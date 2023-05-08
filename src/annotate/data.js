
import { logger } from './log.js'
import { World } from './world.js'
import { Debug } from './debug.js'
import { manager } from './backup/manager.js'
import { copyWorld, setWorld, replaceWorld } from './util.js'

class Data {
  constructor(cfg) {
    this.cfg = cfg
  }

  async readSceneList() {
    const init = { method: 'GET' }

    const req = new Request('/dev-ann-api/get_all_scene_desc', init)

    return fetch(req)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        } else {
          return response.json()
        }
      })
      .then(ret => {
        this.sceneDescList = ret
        return ret
      })
      .catch(reject => {
        console.log('error read scene list!')
      })
  }

  async init() {
    await this.readSceneList()
  }

    // multiple world support
    // place world by a offset so they don't overlap
    dbg = new Debug();

    worldGap = 1000.0;
    worldList = [];
    MaxWorldNumber = 80;
    createWorldIndex = 0; // this index shall not repeat, so it increases permanently

    async getWorld(sceneName, frame, on_preload_finished) {
      // find in list

      if (!this.meta[sceneName]) {
        await this.readSceneMetaData(sceneName)
      }

      if (!this.meta[sceneName]) {
        logger.log('load scene failed', sceneName)
        return null
      }

      let world = this.worldList.find((w) => {
        return w.frameInfo.scene == sceneName && w.frameInfo.frame == frame
      })
      if (world) // found!
      { return world }

      world = this._createWorld(sceneName, frame, on_preload_finished)

      return world
    }

    changeWorld(oldFrame, newWorld) { // pcd不变, 替换标注
      const oldWorld = this.worldList.find((w) => w.frameInfo.frame === oldFrame)
      const world = replaceWorld(newWorld, oldWorld)
      return world
    }

    changeAnno(oldFrame, newWorldData) { // webglGroup会随着_preload自动更新, 数据正确就不用担心
      const oldWorld = this.worldList.find((w) => w.frameInfo.frame === oldFrame)
      setWorld(oldWorld, newWorldData)
      return oldWorld
    }

    _createWorld(sceneName, frame, on_preload_finished) {
      const [x, y, z] = this.allocateOffset()
      console.log('create world', x, y, z)
      const world = new World(this, sceneName, frame, [this.worldGap * x, this.worldGap * y, this.worldGap * z], on_preload_finished)
      world.offsetIndex = [x, y, z]
      this.createWorldIndex++
      this.worldList.push(world) // "worldList" from world.js

      return world
    }

    findWorld(sceneName, frameIndex) {
      const world = this.worldList.find((w) => {
        return w.frameInfo.scene == sceneName && w.frameInfo.frame_index == frameIndex
      })
      if (world) // found!
      { return world } else { return null }
    }

    offsetList = [[0, 0, 0]];
    lastSeedOffset = [0, 0, 0];
    offsetsAliveCount = 0;
    allocateOffset() {
      // we need to make sure the first frame loaded in a scene
      // got to locate in [0,0,0]

      if (this.offsetsAliveCount == 0) {
        // reset offsets.
        this.offsetList = [[0, 0, 0]]
        this.lastSeedOffset = [0, 0, 0]
      }

      if (this.offsetList.length == 0) {
        let [x, y, z] = this.lastSeedOffset

        if (x == y) {
          x = x + 1
          y = 0
        } else {
          y = y + 1
        }

        this.lastSeedOffset = [x, y, 0]

        this.offsetList.push([x, y, 0])

        if (x != 0) this.offsetList.push([-x, y, 0])
        if (y != 0) this.offsetList.push([x, -y, 0])
        if (x * y != 0) this.offsetList.push([-x, -y, 0])

        if (x != y) {
          this.offsetList.push([y, x, 0])

          if (y != 0) this.offsetList.push([-y, x, 0])
          if (x != 0) this.offsetList.push([y, -x, 0])
          if (x * y != 0) this.offsetList.push([-y, -x, 0])
        }
      }

      const ret = this.offsetList.pop()
      this.offsetsAliveCount++

      return ret
    }

    returnOffset(offset) {
      this.offsetList.push(offset)
      this.offsetsAliveCount--
    }

    deleteDistantWorlds(world) {
      const currentWorldIndex = world.frameInfo.frame_index

      const disposable = (w) => {
        const distant = Math.abs(w.frameInfo.frame_index - currentWorldIndex) > this.MaxWorldNumber
        const active = w.everythingDone
        if (w.annotation.modified) {
          console.log('deleting world not saved. stop.')
        }

        return distant && !active && !w.annotation.modified
      }

      const distantWorldList = this.worldList.filter(w => disposable(w))

      distantWorldList.forEach(w => {
        this.returnOffset(w.offsetIndex)
        w.deleteAll()
      })

      this.worldList = this.worldList.filter(w => !disposable(w))
    }

    deleteOtherWorldsExcept = function(keepScene) {
      // release resources if scene changed
      this.worldList.forEach(w => {
        if (w.frameInfo.scene != keepScene) {
          this.returnOffset(w.offsetIndex)
          w.deleteAll()

          this.removeRefEgoPoseOfScene(w.frameInfo.scene)
        }
      })
      this.worldList = this.worldList.filter(w => w.frameInfo.scene == keepScene)
    };

    refEgoPose = {};
    getRefEgoPose(sceneName, currentPose) {
      if (this.refEgoPose[sceneName]) {
        return this.refEgoPose[sceneName]
      } else {
        this.refEgoPose[sceneName] = currentPose
        return currentPose
      }
    }

    removeRefEgoPoseOfScene(sceneName) {
      if (this.refEgoPose[sceneName]) { delete this.refEgoPose[sceneName] }
    }

    forcePreloadScene(sceneName, currentWorld) {
      // this.deleteOtherWorldsExcept(sceneName);
      const meta = currentWorld.sceneMeta

      const currentWorldIndex = currentWorld.frameInfo.frame_index
      const startIndex = Math.max(0, currentWorldIndex - this.MaxWorldNumber / 2)
      const endIndex = Math.min(meta.frames.length, startIndex + this.MaxWorldNumber)

      this._doPreload(sceneName, startIndex, endIndex)

      logger.log(`${endIndex - startIndex} frames created`)
    }

    preloadScene(sceneName, currentWorld) {
      // clean other scenes.
      this.deleteOtherWorldsExcept(sceneName)
      this.deleteDistantWorlds(currentWorld)

      if (!this.cfg.enablePreload) { return }

      this.forcePreloadScene(sceneName, currentWorld)
    }

    _doPreload(sceneName, startIndex, endIndex) {
      const meta = this.getMetaBySceneName(sceneName)

      let numLoaded = 0
      const _need_create = (frame) => {
        const world = this.worldList.find((w) => {
          return w.frameInfo.scene == sceneName && w.frameInfo.frame == frame
        })

        return !world
      }

      const _do_create = (frame) => {
        this._createWorld(sceneName, frame)
        numLoaded++
      }

      const pendingFrames = meta.frames.slice(startIndex, endIndex).filter(_need_create)

      logger.log(`preload ${meta.scene} ${pendingFrames}`)
      // if (numLoaded > 0){
      //     meta.frames.slice(endIndex, Math.min(endIndex+5, meta.frames.length)).forEach(_do_create);
      //     meta.frames.slice(Math.max(0, startIndex-5), startIndex).forEach(_do_create);
      // }

      pendingFrames.forEach(_do_create)

      const initialAction = {
        name: 'initialWorld',
        params: copyWorld(this.world)
      }
      manager.initManager(initialAction)
    }

    reloadAllAnnotation = function(done) {
      this.worldList.forEach(w => w.reloadAnnotation(done))
    };

    onAnnotationUpdatedByOthers(scene, frames) {
      frames.forEach(f => {
        const world = this.worldList.find(w => (w.frameInfo.scene == scene && w.frameInfo.frame == f))
        if (world) { world.annotation.reloadAnnotation() }
      })
    }

    webglScene = null;
    set_webglScene = function(scene, mainScene) {
      this.webglScene = scene
      this.webglMainScene = mainScene
    };

    scale_point_size(v) {
      this.cfg.point_size *= v
      // if (this.world){
      //     this.world.lidar.set_point_size(this.cfg.point_size);
      // }

      this.worldList.forEach(w => {
        w.lidar.set_point_size(this.cfg.point_size)
      })
    }

    scale_point_brightness(v) {
      this.cfg.point_brightness *= v

      // if (this.world){
      //     this.world.lidar.recolor_all_points();
      // }

      this.worldList.forEach(w => {
        w.lidar.recolor_all_points()
      })
    }

    set_box_opacity(opacity) {
      this.cfg.box_opacity = opacity

      this.worldList.forEach(w => {
        w.annotation.set_box_opacity(this.cfg.box_opacity)
      })
    }

    toggle_background() {
      this.cfg.show_background = !this.cfg.show_background

      if (this.cfg.show_background) {
        this.world.lidar.cancel_highlight()
      } else {
        this.world.lidar.hide_background()
      }
    }

    set_obj_color_scheme(scheme) {
      pointsGlobalConfig.color_obj = scheme

      // if (pointsGlobalConfig.color_obj != "no"){
      //     this.world.lidar.color_points();
      // } else {
      //     this.world.lidar.set_points_color({
      //         x: this.cfg.point_brightness,
      //         y: this.cfg.point_brightness,
      //         z: this.cfg.point_brightness,
      //     });
      // }

      // this.world.lidar.update_points_color();
      // this.world.annotation.color_boxes();

      // toto: move to world
      this.worldList.forEach(w => {
        if (pointsGlobalConfig.color_obj == 'no') {
          w.lidar.color_points()
        } else {
          w.lidar.color_objects()
        }

        w.lidar.update_points_color()

        w.annotation.color_boxes()
      })
    }

    // active_camera_name = "";

    // // return null means not changed.
    // set_active_image(name){
    //     if (name === this.active_camera_name){
    //         return null;
    //     }

    //     this.active_camera_name = name;
    //     if (this.world){
    //         this.world.cameras.activate(name);
    //     }
    //     this.worldList.forEach(w=>w.cameras.activate(name));

    //     return name;
    // };

    world = null;

    // this.future_world_buffer = [];
    // this.put_world_into_buffer= function(world){
    //     this.future_world_buffer.push(world);
    // };

    // this.reset_world_buffer= function(){
    //     this.future_world_buffer=[];
    // };

    // this.activateMultiWorld=function(world, on_finished){
    //     world.activate(this.webglScene,
    //         null,  //don't destroy old world
    //         on_finished);
    //     this.worldList.push(world);
    // };

    activate_world = function(world, on_finished, dontDestroyOldWorld) {
      if (dontDestroyOldWorld) {
        world.activate(this.webglScene, null, on_finished)
      } else {
        var old_world = this.world // current world, should we get current world later?
        this.world = world // swich when everything is ready. otherwise data.world is half-baked, causing mysterious problems.

        world.activate(this.webglMainScene,
          function() {
            if (old_world) { old_world.unload() }
          },
          on_finished)
      }
    };

    meta = {}; // meta data

    getMetaBySceneName = (sceneName) => {
      return this.meta[sceneName]
    };

    get_current_world_scene_meta() {
      return this.getMetaBySceneName(this.world.frameInfo.scene)
    }

    getWorldByFrame(frame) { // search world in worldList by frame.
      const world = this.worldList.find((w) => {
        return w.frameInfo.frame === frame
      })
      return world
    }

    readSceneMetaData(sceneName) {
      const self = this
      return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest()

        xhr.onreadystatechange = function() {
          if (this.readyState != 4) { return }

          if (this.status == 200) {
            const sceneMeta = JSON.parse(this.responseText)
            self.meta[sceneName] = sceneMeta
            resolve(sceneMeta)
          }
        }

        xhr.open('GET', `/dev-ann-api/scenemeta?scene=${sceneName}`, true)
        xhr.send()
      })
    }
}

export { Data }
