export const editorTemplate = `
<div id="main-ui" class="editor-ui">
        <div id="header">
            <div id="tools">
                <div class="header-selector-container">
                <label for="scene-selector">任务名称:</label>
                <span id="scene-selector-name"></span>
                <select id="scene-selector" style="display:none">
                    <option>--scene--</option>
                </select>
                </div>
                <div class="header-selector-container">
                  <label for="camera-selector">相机列表:</label>
                  <select id="camera-selector">
                      <option>--camera--</option>
                  </select>
                </div>
                <div class="header-selector-container">
                  <label for="object-selector">对象列表:</label>
                  <select id="object-selector">
                      <option>--object--</option>
                  </select>
                </div>
                <div id="undo" class="header-button" title="undo">
                  <!--  <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M 12 20 A 8 8 0 1 1 20 12  M 21 9 L 20 12 L 18 10" /> </g> </svg> -->
                  <svg t="1684742217384" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23626" width="18" height="18"><path d="M452.266667 413.866667V305.066667a25.173333 25.173333 0 0 0-40.106667-20.906667L145.066667 469.333333a25.6 25.6 0 0 0 0 42.666667l267.093333 186.453333a25.6 25.6 0 0 0 40.106667-21.333333V610.133333a25.6 25.6 0 0 1 26.88-25.6 341.333333 341.333333 0 0 1 301.653333 263.68 336.64 336.64 0 0 0-304.213333-409.173333 25.173333 25.173333 0 0 1-24.32-25.173333z" fill="#808080" p-id="23627"></path></svg>
                  <span>撤销</span>
                </div>
                <div id="redo" class="header-button" title="redo">
                  <!--  <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M 12 20 A 8 8 0 1 1 20 12  M 21 9 L 20 12 L 18 10" /> </g> </svg> -->
                  <svg t="1684742235203" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23840" width="18" height="18"><path d="M512 371.2V261.973333a25.6 25.6 0 0 1 40.106667-20.906666L819.2 426.666667a25.6 25.6 0 0 1 0 42.666666l-267.093333 186.453334a25.6 25.6 0 0 1-40.106667-20.906667V567.466667a25.173333 25.173333 0 0 0-26.88-25.6 341.333333 341.333333 0 0 0-301.653333 263.68 336.64 336.64 0 0 1 304.64-409.173334 25.173333 25.173333 0 0 0 23.893333-25.173333z" fill="#808080" p-id="23841"></path></svg>
                  <span>恢复</span>
                </div>
                <div id='btn-reload-scene-list' class="header-button" title="reload scene list">
                  <!--   <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M 12 20 A 8 8 0 1 1 20 12  M 21 9 L 20 12 L 18 10" /> </g> </svg> -->
                  <svg t="1684742110507" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21040" id="mx_n_1684742110507" width="14" height="14"><path d="M965.973333 552.96c-8.533333 49.493333-23.893333 97.28-46.08 143.36-59.733333 138.24-196.266667 226.986667-348.16 225.28-75.093333 3.413333-150.186667-6.826667-221.866666-32.426667V887.466667l-30.72 75.093333c-5.12 8.533333-11.946667 15.36-20.48 20.48-6.826667 3.413333-13.653333 5.12-20.48 5.12-6.826667 0-13.653333-1.706667-18.773334-5.12-5.12-1.706667-8.533333-3.413333-13.653333-6.826667l-5.12-5.12-155.306667-256c-3.413333-6.826667-6.826667-13.653333-6.826666-20.48 0-5.12 0-10.24 1.706666-17.066666 1.706667-5.12 3.413333-8.533333 6.826667-11.946667l10.24-10.24c3.413333-3.413333 6.826667-5.12 10.24-6.826667 5.12-1.706667 6.826667-3.413333 8.533333-3.413333 1.706667 3.413333 3.413333 3.413333 3.413334 3.413333l271.36-69.973333c11.946667-3.413333 22.186667-3.413333 34.133333-1.706667 6.826667 1.706667 15.36 3.413333 22.186667 5.12 5.12 1.706667 10.24 6.826667 11.946666 11.946667 1.706667 5.12 3.413333 8.533333 5.12 13.653333v13.653334c0 3.413333-1.706667 6.826667-1.706666 10.24 0 1.706667-1.706667 1.706667-1.706667 3.413333l-32.426667 75.093333c51.2 18.773333 104.106667 30.72 158.72 37.546667 42.666667 5.12 85.333333 3.413333 128-3.413333 34.133333-6.826667 66.56-18.773333 97.28-34.133334 25.6-13.653333 49.493333-29.013333 71.68-47.786666 17.066667-15.36 32.426667-32.426667 46.08-51.2 13.653333-18.773333 22.186667-32.426667 25.6-39.253334 6.826667-8.533333 8.533333-15.36 10.24-18.773333zM58.026667 453.973333C69.973333 395.946667 90.453333 341.333333 119.466667 290.133333 191.146667 158.72 332.8 83.626667 481.28 95.573333c68.266667 0 136.533333 13.653333 201.386667 37.546667l32.426666-73.386667c3.413333-6.826667 8.533333-11.946667 15.36-17.066666 5.12-3.413333 10.24-6.826667 15.36-6.826667 1.706667-1.706667 6.826667-1.706667 11.946667-1.706667 5.12 0 8.533333 1.706667 13.653333 3.413334l10.24 5.12c3.413333 1.706667 5.12 3.413333 6.826667 5.12l3.413333 3.413333 150.186667 259.413333c3.413333 6.826667 5.12 13.653333 5.12 20.48 0 5.12 0 10.24-1.706667 17.066667-1.706667 5.12-3.413333 8.533333-6.826666 11.946667-3.413333 3.413333-6.826667 6.826667-10.24 8.533333-3.413333 1.706667-6.826667 5.12-10.24 6.826667l-8.533334 3.413333s-1.706667 1.706667-3.413333 1.706667l-273.066667 63.146666c-15.36 3.413333-30.72 3.413333-44.373333-1.706666-8.533333-1.706667-17.066667-5.12-22.186667-13.653334-3.413333-6.826667-5.12-11.946667-5.12-18.773333 0-5.12 0-10.24 1.706667-17.066667 0-3.413333 1.706667-5.12 3.413333-6.826666l34.133334-73.386667c-51.2-20.48-104.106667-34.133333-158.72-40.96-42.666667-5.12-85.333333-5.12-128 0-34.133333 5.12-66.56 17.066667-97.28 32.426667-25.6 11.946667-51.2 27.306667-73.386667 46.08-17.066667 15.36-34.133333 32.426667-49.493333 51.2-10.24 11.946667-18.773333 25.6-27.306667 37.546666-5.12 5.12-6.826667 10.24-8.533333 15.36z" fill="#808080" p-id="21041"></path></svg>
                  <span>刷新</span>
                </div>
                <div id="use-previous-frame" class="header-button" title="use previous world">
                  <!--  <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M 12 20 A 8 8 0 1 1 20 12  M 21 9 L 20 12 L 18 10" /> </g> </svg> -->
                  <svg t="1684741767964" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12570" width="14" height="14"><path d="M678.758927 731.426377a51.930909 51.930909 0 0 0 52.66233-51.930909V51.936029A51.930909 51.930909 0 0 0 678.758927 0.00512H51.930909A51.930909 51.930909 0 0 0 0 51.936029v627.559439a51.930909 51.930909 0 0 0 51.930909 51.930909h626.828018z" p-id="12571" fill="#808080"></path><path d="M971.32743 292.573623H804.563383v454.212601a57.782279 57.782279 0 0 1-57.782279 57.782279H292.568503v167.495468a51.930909 51.930909 0 0 0 52.66233 51.930909h626.828018a51.930909 51.930909 0 0 0 51.930909-51.930909V344.504532a51.930909 51.930909 0 0 0-52.66233-51.930909z" p-id="12572" fill="#808080"></path></svg>
                  <span>使用上帧</span>
                </div>
                <div id="camera-front-img-container-toggle" class="header-button" title="显示/隐藏前相机视图">
                  <svg t="1684743693956" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25847" width="14" height="14"><path d="M928 192l-185.6 0-57.6-96C678.4 76.8 652.8 64 633.6 64L390.4 64C371.2 64 345.6 76.8 339.2 96L281.6 192 96 192C44.8 192 0 236.8 0 288l0 576C0 915.2 44.8 960 96 960l832 0c51.2 0 96-44.8 96-96l0-576C1024 236.8 979.2 192 928 192zM512 832c-160 0-288-128-288-288C224 384 352 256 512 256s288 128 288 288C800 704 672 832 512 832z" p-id="25848" fill="#808080"></path><path d="M512 544m-192 0a3 3 0 1 0 384 0 3 3 0 1 0-384 0Z" p-id="25849" fill="#808080"></path></svg>
                  <span>隐藏前相机</span>
                </div>
                <div id="camera-left-img-container-toggle" class="header-button" title="显示/隐藏左相机视图">
                  <svg t="1684743693956" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25847" width="14" height="14"><path d="M928 192l-185.6 0-57.6-96C678.4 76.8 652.8 64 633.6 64L390.4 64C371.2 64 345.6 76.8 339.2 96L281.6 192 96 192C44.8 192 0 236.8 0 288l0 576C0 915.2 44.8 960 96 960l832 0c51.2 0 96-44.8 96-96l0-576C1024 236.8 979.2 192 928 192zM512 832c-160 0-288-128-288-288C224 384 352 256 512 256s288 128 288 288C800 704 672 832 512 832z" p-id="25848" fill="#808080"></path><path d="M512 544m-192 0a3 3 0 1 0 384 0 3 3 0 1 0-384 0Z" p-id="25849" fill="#808080"></path></svg>
                  <span>隐藏左相机</span>
                </div>
                <div id="camera-right-img-container-toggle" class="header-button" title="显示/隐藏右相机视图">
                  <svg t="1684743693956" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25847" width="14" height="14"><path d="M928 192l-185.6 0-57.6-96C678.4 76.8 652.8 64 633.6 64L390.4 64C371.2 64 345.6 76.8 339.2 96L281.6 192 96 192C44.8 192 0 236.8 0 288l0 576C0 915.2 44.8 960 96 960l832 0c51.2 0 96-44.8 96-96l0-576C1024 236.8 979.2 192 928 192zM512 832c-160 0-288-128-288-288C224 384 352 256 512 256s288 128 288 288C800 704 672 832 512 832z" p-id="25848" fill="#808080"></path><path d="M512 544m-192 0a3 3 0 1 0 384 0 3 3 0 1 0-384 0Z" p-id="25849" fill="#808080"></path></svg>
                  <span>隐藏右相机</span>
                </div>
                <div id="img-editor-toggle" class="header-button" title="显示/隐藏2D标注区">
                <svg t="1686125571451" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7997" data-darkreader-inline-fill="" width="14" height="14"><path d="M861.428838 256.64727c2.413056 5.362074 4.346163 11.614515 5.808538 18.76439 1.49207 7.146803 2.232934 14.593331 2.232934 22.336717 0 7.743386-1.487974 15.481549-4.468941 23.224934-2.988134 7.745434-7.754957 15.191962-14.291046 22.336717-7.149158 7.150899-13.550182 13.402214-19.212288 18.762342-5.659136 5.361152-10.572186 10.126643-14.743347 14.296576-4.7616 4.764467-9.231667 8.935526-13.401805 12.506829L636.272845 221.804646c7.146086-6.552269 15.635763-14.44393 25.460941-23.679283 9.82825-9.232282 18.021171-16.525414 24.572621-21.888512 8.340275-6.551245 16.979354-11.167334 25.914266-13.850419 8.932762-2.677965 17.72032-3.870106 26.355302-3.571302 8.63703 0.299827 16.974234 1.639322 25.019802 4.020531 8.040448 2.382234 15.036006 5.061222 20.990874 8.042189 12.514509 6.557389 26.36247 18.01943 41.552077 34.397389C841.324134 221.652173 853.092659 238.780314 861.428838 256.64727L861.428838 256.64727zM165.404774 692.651418c3.572531-3.57335 11.91383-12.06272 25.015706-25.46391 13.105971-13.403238 29.487821-29.929677 49.141146-49.587405l65.228186-65.217331 72.373248-72.370278 192.09984-192.094003 167.07799 167.967539L544.243098 647.977984l-71.47776 72.370278c-23.826637 23.22903-45.270835 44.52608-64.331776 63.882957-19.059814 19.358925-34.848051 35.289702-47.355392 47.798682-12.510413 12.507853-19.956326 19.65568-22.337638 21.443379-5.952819 5.360128-12.808192 11.017933-20.547789 16.972595-7.742669 5.960806-15.783117 10.72425-24.12544 14.296576-8.336179 4.170957-20.549837 9.231258-36.634829 15.18889-16.080896 5.955686-32.907776 11.762893-50.480742 17.421824-17.56887 5.662003-34.247373 10.574848-50.036634 14.745805-15.784141 4.163789-27.545498 6.849024-35.290112 8.037069-16.086016 1.787699-26.804531-0.595558-32.166912-7.146803-5.360333-6.549197-6.849229-17.568154-4.467917-33.057894 1.192243-8.33792 4.023808-20.396544 8.490701-36.184064 4.467917-15.785472 9.231667-32.162509 14.29207-49.140224 5.065523-16.972595 9.977651-32.60969 14.745395-46.904218 4.764672-14.293504 8.633958-24.123392 11.614003-29.48352 3.574579-8.336896 7.596339-15.932928 12.062208-22.782874C150.663475 708.583219 157.068595 700.991386 165.404774 692.651418L165.404774 692.651418zM165.404774 692.651418M463.329075 861.160243l79.902003 0 0 79.548723-79.902003 0 0-79.548723ZM625.668915 861.160243l79.902003 0 0 79.548723-79.902003 0 0-79.548723ZM788.655514 861.160243l79.902003 0 0 79.548723-79.902003 0 0-79.548723Z" p-id="7998" fill="#808080"></path></svg>
                  <span>隐藏编辑器</span>
                </div>
                <div id="qc-comment-container-toggle" class="header-button" title="显示/隐藏质检批注">
                  <svg t="1684743807560" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26217" width="14" height="14"><path d="M899.195018 129.527029H122.811582c-30.627555 0-55.456033 24.961508-55.456033 55.752791v557.52587c0 30.791284 24.828478 55.752792 55.456033 55.752791h277.280164l91.280959 91.769077c5.202489 5.243421 12.265348 8.18952 19.631106 8.189519s14.429641-2.947122 19.631107-8.189519l91.280959-91.769077h277.280164c30.627555 0 55.456033-24.961508 55.456033-55.752791V185.278797c-0.001023-30.791284-24.829502-55.751768-55.457056-55.751768zM491.285724 445.00926H156.085406c-16.335037 0-29.576619-13.241582-29.576619-29.576619s13.241582-29.576619 29.576619-29.576619h335.200318c16.335037 0 29.576619 13.241582 29.576619 29.576619s-13.242606 29.576619-29.576619 29.576619zM688.462502 326.703807H156.085406c-16.335037 0-29.576619-13.241582-29.576619-29.576619s13.241582-29.576619 29.576619-29.576619h532.377096c16.335037 0 29.576619 13.241582 29.576619 29.576619s-13.242606 29.576619-29.576619 29.576619z" p-id="26218" fill="#808080"></path></svg>
                  <span>显示批注</span>
                </div>
            </div>
            <!-- <text id="box"></text> -->
            <!-- <text id="ref-obj"></text> -->
            <div id="frame-name-container" class="frame-name-container"></div>
            <div id="buttons" class="header-right-buttons">
                <input type="checkbox" id="if-default-attribute-use" name="if-default-attribute-use" />
                <label for="if-default-attribute-use" id="if-default-attribute-label" value="y">属性预设</label>
                <select id="attribute-selector" disabled="true"></select>
                <input type="checkbox" id="if-default-category-use" name="if-default-category-use" />
                <label for="if-default-category-use" id="if-default-category-label" value="y">分类预设</label>
                <select id="category-selector" disabled="true">
                    <option value="">--category--</option>
                </select>
                <div id="dynamic-buttons-placeholder"> </div>
                <div class="func-buttons">
                  <div id="exit-button" class="f-button btn-warning">退出</div>
                  <div id="marker-buttons" class="marker-buttons">
                    <div id="fn-suspend-button" class="f-button btn-success">挂起</div>
                    <div id="fn-submit-button" class="f-button btn-primary">提交</div>
                  </div>
                  <div id="tester-buttons" class="tester-buttons">
                    <div id="fn-reject-button" class="f-button btn-danger">驳回</div>
                    <div id="fn-pass-button" class="f-button btn-success">通过</div>
                  </div>
                  <div id="accepter-buttons" class="accepter-buttons">
                    <div id="fn-qf-button" class="f-button btn-success">合格</div>
                    <div id="fn-disqf-button" class="f-button btn-danger">不合格</div>
                  </div>
                </div>
                <div id="static-buttons">
                    <div id="changed-mark" class="ui-button">
                        <div id='save-button'>
                            <!-- 手动保存 -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M 4 4 L 18 4 L 20 6 L 20 20 L 4 20 Z M 8 4 h 8 v 2 h -8 z M 6 10 h 12 V 18 h -12 z "> </path> </g> </svg>
                            <div id="save-feedback">
                                <div id="save-triangle"></div>
                                <div id="save-content">保存成功</div>
                            </div>
                        </div>
                        <div id="changed-world-list-wrapper">
                            <div> All modified frames, click to save them all</div>
                            <div id='changed-world-list'></div>
                        </div>
                    </div>
                    <div id="log-button" class="ui-button">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" id="log-svg" class="svg-button"> <g> <circle cx=12 cy=12 r=4 /> </g> </svg>
                    </div>
                    <div id="config-button" class="ui-button">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <circle cx=12 cy=7 r=1 /> <circle cx=12 cy=12 r=1 /> <circle cx=12 cy=17 r=1 /> </g> </svg>
                    </div>
                </div>
            </div>
        </div>
        <div id="content">
            <div id="container">
                <div id='select-box'></div>
                <svg width="100%" height="100%" id="main-view-svg"> <g id="grid-lines-wrapper"></g> </svg>
            </div>
            <!-- div id="image"></div -->
            <div id="floating-things">
                <div id="floating-labels" class="non-selectable"></div>
                <div id="obj-editor">
                    <div class="obj-editor-row">
                        <div id="label-copy" class="ui-button" title="copy (C-c)">
                            <!-- <span class="ui-icon ui-icon-copy"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <!-- <rect x="4" y="4" width="12" height="12"/> --> <rect x="8" y="8" width="12" height="12" /> <polyline points="8 16 4 16 4 4 16 4 16 8 " /> </g> </svg>
                        </div>
                        <div id="label-paste" class="ui-button" title="auto adjust">
                            <!-- <span class="ui-icon ui-icon-key"></span></div> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <!-- <rect x="4" y="8" width="16" height="12"/> <circle cx="12" cy="8" r = "4"/>								 --> <circle cx=12 cy=12 r=4 /> <rect x=10 y=16 width=4 height=4 /> <polyline points='12 3 12 6' /> <polyline points='3 12 6 12' /> <polyline points='18 12 21 12' /> <polyline points='5 5 8 8' /> <polyline points='18 5 15 8' /> </g> </svg>
                        </div>
                        <div id="label-batchedit" class="ui-button" title="edit multiple instances">
                            <!-- <span class="ui-icon ui-icon-zoomin"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <rect x="4" y="4" width="8" height="8" /> <rect x="4" y="12" width="8" height="8" /> <rect x="12" y="4" width="8" height="8" /> </g> </svg>
                        </div>
                        <div id="label-trajectory" class="ui-button" title="trajectory">
                            <!-- <span class="ui-icon ui-icon-zoomin"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M 4 4 C 20 4, 4 20, 20 20" /> </g> </svg>
                        </div>
                        <div id="label-highlight" class="ui-button" title="focus">
                            <!-- <span class="ui-icon ui-icon-zoomin"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <circle cx="10" cy="10" r="7" /> <polyline points="15 15 20 20" /> <polyline points="10 6 10 14" /> <polyline points="6 10 14 10" /> </g> </svg>
                        </div>
                        <div id="label-edit" class="ui-button" title="edit">
                            <!-- <span class="ui-icon ui-icon-pencil"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <polyline points="12 4 12 20" /> <polyline points="4 9 12 9" /> <polyline points="8 5 12 9 8 13" /> <polyline points="20 15 12 15" /> <!-- <polyline points="16 19 12 15  16 11" /> --> </svg>
                        </div>
                        <div id="label-rotate" class="ui-button" title="reverse direction (g)">
                            <!-- <span class="ui-icon ui-icon-transferthick-e-w"></span></div> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <!-- <rect x=6 y=4 width=12 height=8 /> <polyline points="12 12 12 20" /> <polyline points="8 16 12 20 16 16" /> --> <rect x=8 y=8 width=8 height=8 /> <polyline points="12 12 12 21" /> <polyline points="10 19 12 21 14 19" /> <polyline points="12 12 12 3" stroke-dasharray="1" /> <polyline points="10 5 12 3 14 5" stroke-dasharray="1" /> </g> </svg>
                        </div>
                        <div id="label-del" class="ui-button" title="delete (Del)">
                            <!-- <span class="ui-icon ui-icon-trash"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"> </path> </g> </svg>
                        </div>
                        <div id="label-more" class="ui-button">
                            <!-- <span class="ui-icon ui-icon-trash"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <g> <circle cx="7" cy="12" r="0.5"></circle> <circle cx="12" cy="12" r="0.5"></circle> <circle cx="17" cy="12" r="0.5"></circle> </g> </g> </svg>
                            <div id="object-dropdown-menu" class="non-selectable">
                                <div class="menu-item" id="cm-modify-obj-type">
                                    <div class="menu-item-icon"></div>
                                    <div class="menu-item-text">同步对象类型和属性</div>
                                </div>
                                <div class="menu-item" id="cm-modify-obj-size">
                                    <div class="menu-item-icon"></div>
                                    <div class="menu-item-text">同步对象大小</div>
                                </div>
                                <div class="menu-item menu-seperator"></div>
                                <div class="menu-item" id="cm-auto-ann-background">
                                    <div class="menu-item-icon"></div>
                                    <div class="menu-item-text">在后台自动显示</div>
                                </div>
                                <div class="menu-item" id="cm-interpolate-background">
                                    <div class="menu-item-icon"></div>
                                    <div class="menu-item-text">在背景中插值</div>
                                </div>
                                <div class="menu-item menu-seperator"></div>
                                <div class="menu-item" id="cm-select-as-ref">
                                    <div class="menu-item-icon"></div>
                                    <div class="menu-item-text">复制/选择 作为参考</div>
                                </div>
                                <div class="menu-item menu-seperator"></div>
                                <div class="menu-item" id="cm-change-id-to-ref">
                                    <div class="menu-item-icon"></div>
                                    <div class="menu-item-text">Change ID to Ref</div>
                                </div>
                                <div class="menu-item" id="cm-change-id-to-ref-in-scene">
                                    <div class="menu-item-icon"></div>
                                    <div class="menu-item-text">Change ID to Ref in all frames</div>
                                </div>
                                <div class="menu-item menu-seperator"></div>
                                <div class="menu-item" id="cm-follow-ref">
                                    <div class="menu-item-icon"></div>
                                    <div class="menu-item-text">跟随参考</div>
                                </div>
                                <div class="menu-item" id="cm-sync-followers">
                                    <div class="menu-item-icon"></div>
                                    <div class="menu-item-text">同步跟随者</div>
                                </div>
                                <div class="menu-item" id="cm-follow-static-objects">
                                    <div class="menu-item-icon"></div>
                                    <div class="menu-item-text">跟随静态对象</div>
                                </div>
                                <div class="menu-item menu-seperator"></div>
                                <div class="menu-item" id="cm-delete-obj">
                                    <div class="menu-item-icon"></div>
                                    <div class="menu-item-text">删除此对象（在所有帧中）</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="obj-editor-row">
                        <label for="object-category-selector">类型</label>
                        <select title="category" id="object-category-selector"></select>
                        <label for="object-track-id-editor">编号</label>
                        <input title="tracking id" list="obj-ids-of-scene" id="object-track-id-editor" type="text" size="5" placeholder="track id"></input>
                        <datalist id="obj-ids-of-scene"></datalist>
                        <div id="label-gen-id" class="ui-button" title="generate ID">
                            <!-- <span class="ui-icon ui-icon-copy"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <!-- <rect x="4" y="4" width="12" height="12"/> --> <rect x="6" y="6" width="12" height="12" /> </g> </svg>
                        </div>
                    </div>
                    <div class="obj-editor-row">
                        <label for="object-trunk-selector">截断</label>
                        <select title="attribute" id="object-trunk-selector"></select>
                        <label for="object-occlusion-selector">遮挡</label>
                        <select title="occlusion" id="object-occlusion-selector"></select>
                    </div>
                    <div class="obj-editor-row">
                        <label for="object-x-info">红X</label>
                        <input title="x" id="object-x-info" readonly/>
                        <label for="object-y-info">绿Y</label>
                        <input title="y" id="object-y-info" readonly/>
                        <label for="object-z-info">蓝Z</label>
                        <input title="z" id="object-z-info" readonly/>
                    </div>
                    <div class="obj-editor-row">
                        <label for="object-size-info">合规</label>
                        <input title="x" id="object-size-info" readonly/>
                    </div>
                </div>
            </div>
            <div id="main-box-editor-wrapper"></div>
            <div id="batch-box-editor">
                <div id="batch-box-editor-header"></div>
                <div id="batch-box-editor-group"></div>
            </div>
        </div>
        <div id="context-menu-wrapper" class="non-selectable">
            <div id="context-menu">
                <div class="menu-item" id="cm-new">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">新建车辆属性</div>
                    <div class="menu-item-arrow menu-item-icon">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-menu-icon"> <g> <path d="M12 8 L 18 12 L 12 16Z"></path> </g> </svg>
                    </div>
                    <div id="new-submenu"> </div>
                </div>
                <div class="menu-item" id="cm-paste" title="hold shift key to disable auto-adjust">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">粘贴</div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cm-goto">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">跳转</div>
                    <div class="menu-item-arrow menu-item-icon">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-menu-icon"> <g> <path d="M12 8 L 18 12 L 12 16Z"></path> </g> </svg>
                    </div>
                    <div id="goto-submenu">
                        <div class="menu-item" id="cm-prev-frame">
                            <div class="menu-item-icon"></div>
                            <div class="menu-item-text">上一帧 (3)</div>
                        </div>
                        <div class="menu-item" id="cm-next-frame">
                            <div class="menu-item-icon"></div>
                            <div class="menu-item-text">下一帧 (4)</div>
                        </div>
                        <div class="menu-item" id="cm-first-frame">
                            <div class="menu-item-icon"></div>
                            <div class="menu-item-text">第一帧</div>
                        </div>
                        <div class="menu-item" id="cm-last-frame">
                            <div class="menu-item-icon"></div>
                            <div class="menu-item-text">最后一帧</div>
                        </div>
                        <div class="menu-item menu-seperator"></div>
                        <div class="menu-item" id="cm-prev-object">
                            <div class="menu-item-icon"></div>
                            <div class="menu-item-text">上一个对象 (1)</div>
                        </div>
                        <div class="menu-item" id="cm-next-object">
                            <div class="menu-item-icon"></div>
                            <div class="menu-item-text">下一个对象 (2)</div>
                        </div>
                        <div class="menu-item menu-seperator"></div>
                        <div class="menu-item" id="cm-go-to-10hz">
                            <div class="menu-item-icon"></div>
                            <div class="menu-item-text">全10hz场景</div>
                        </div>
                        <div class="menu-item" id="cm-go-to-full-2hz">
                            <div class="menu-item-icon"></div>
                            <div class="menu-item-text">全2Hz场景</div>
                        </div>
                        <div class="menu-item" id="cm-go-to-2hz">
                            <div class="menu-item-icon"></div>
                            <div class="menu-item-text">2Hz场景</div>
                        </div>
                    </div>
                </div>
                <div class="menu-item" id="cm-play">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">播放</div>
                    <div class="menu-item-arrow menu-item-icon">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-menu-icon"> <g> <path d="M12 8 L 18 12 L 12 16Z"></path> </g> </svg>
                    </div>
                    <div id="play-submenu">
                        <div class="menu-item" id="cm-play-2fps">
                            <div class="menu-item-text">2 FPS</div>
                        </div>
                        <div class="menu-item" id="cm-play-10fps">
                           <div class="menu-item-text">10 FPS</div>
                        </div>
                        <div class="menu-item" id="cm-play-20fps">
                           <div class="menu-item-text">20 FPS</div>
                        </div>
                        <div class="menu-item" id="cm-play-50fps">
                            <div class="menu-item-text">50 FPS</div>
                        </div>
                    </div>
                </div>
                <div class="menu-item" id="cm-pause">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">暂停</div>
                </div>
                <div class="menu-item" id="cm-stop">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">Stop</div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cm-save">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">保存</div>
                </div>
                <!-- <div class="menu-item" id="cm-save-all">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">Save All</div>
                    <div id="saveall-submenu"></div>
                </div> -->
                <div class="menu-item" id="cm-reload">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">重新加载当前帧</div>
                </div>
                <div class="menu-item" id="cm-reload-all">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">全部重新加载</div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cm-reset-view">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">重置视图</div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cm-show-frame-info">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">帧信息</div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cm-show-stat">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">统计</div>
                </div>
                <div class="menu-item" id="cm-check-scene">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">Check</div>
                </div>
            </div>
            <div id="object-context-menu">
                <div class="menu-item" id="cm-modify-obj-type">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">同步对象类型和属性</div>
                </div>
                <div class="menu-item" id="cm-modify-obj-size">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">同步对象大小</div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cm-edit-multiple-instances">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">编辑多个实例</div>
                </div>
                <div class="menu-item" id="cm-auto-ann-background">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">在后台自动显示</div>
                </div>
                <div class="menu-item" id="cm-interpolate-background">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">在背景中插值</div>
                </div>
                <div class="menu-item" id="cm-show-trajectory">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">显示轨迹</div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cm-select-as-ref">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">复制/选择 作为参考</div>
                </div>
                <div class="menu-item" id="cm-follow-ref">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">跟随参考</div>
                </div>
                <div class="menu-item" id="cm-sync-followers">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">同步追随者</div>
                </div>
                <div class="menu-item" id="cm-follow-static-objects">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">跟随静态对象</div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cm-delete">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text">删除</div>
                </div>
                <div class="menu-item" id="cm-delete-obj">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">删除此对象（在所有帧中）</div>
                </div>
            </div>
            <div id="box-editor-context-menu">
                <div class="menu-item" id="cm-select-all">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text"><u>S</u>elect all</div>
                </div>
                <div class="menu-item" id="cm-select-all-previous">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text">Select all previous</div>
                </div>
                <div class="menu-item" id="cm-select-all-next">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text">Select all next</div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cm-delete-empty-boxes">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text">Delete empty boxes</div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cm-delete">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text"><u>D</u>elete</div>
                </div>
                <div class="menu-item" id="cm-delete-intersected-boxes">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text">Delete intersected boxes</div>
                </div>
                <div class="menu-item" id="cm-interpolate">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text">Int<u>e</u>rpolate</div>
                </div>
                <div class="menu-item" id="cm-auto-annotate">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text"><u>A</u>uto annotate</div>
                </div>
                <div class="menu-item" id="cm-auto-annotate-wo-rotation">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text">Auto annotate (no rotation)</div>
                </div>
                <div class="menu-item" id="cm-fit">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">Fit</div>
                    <div class="menu-item-arrow menu-item-icon">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-menu-icon"> <g> <path d="M12 8 L 18 12 L 12 16Z"></path> </g> </svg>
                    </div>
                    <div id="cm-fit-submenu">
                        <div class="menu-item" id="cm-fit-size">
                            <div class="menu-item-text">Size</div>
                        </div>
                        <div class="menu-item" id="cm-fit-position">
                            <div class="menu-item-text">Position</div>
                        </div>
                        <div class="menu-item" id="cm-fit-rotation">
                            <div class="menu-item-text">Rotation</div>
                        </div>
                        <div class="menu-item" id="cm-fit-moving-direction">
                            <div class="menu-item-text">Moving direction</div>
                        </div>
                        <div class="menu-item menu-seperator"></div>
                        <div class="menu-item" id="cm-fit-top">
                            <div class="menu-item-text">Top</div>
                        </div>
                        <div class="menu-item" id="cm-fit-bottom">
                            <div class="menu-item-text">Bottom</div>
                        </div>
                        <div class="menu-item" id="cm-fit-left">
                            <div class="menu-item-text">Left</div>
                        </div>
                        <div class="menu-item" id="cm-fit-right">
                            <div class="menu-item-text">Right</div>
                        </div>
                        <div class="menu-item" id="cm-fit-front">
                            <div class="menu-item-text">Front</div>
                        </div>
                        <div class="menu-item" id="cm-fit-rear">
                            <div class="menu-item-text">Rear</div>
                        </div>
                    </div>
                </div>
                <div class="menu-item" id="cm-reverse-direction">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">Reverse heading direction</div>
                </div>
                <div class="menu-item" id="cm-reset-roll-pitch">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">Reset roll & pitch</div>
                </div>
                <div class="menu-item" id="cm-finalize">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text"><u>F</u>inalize</div>
                </div>
                <div class="menu-item" id="cm-reload">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text">Reload</div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cm-goto-this-frame">
                    <div class="menu-item-text"><u>G</u>o to this frame</div>
                </div>
                <div class="menu-item" id="cm-sync-size">
                    <div class="menu-item-text">Sync size to all</div>
                </div>
                <div class="menu-item" id="cm-follow-static-objects">
                    <div class="menu-item-text">Follow static objects</div>
                </div>
                <!-- <div class="menu-item" id="cm-this">
                    <div class="menu-item-icon"></div>
                    <div class="menu-item-text">This frame</div>
                    <div class="menu-item-arrow menu-item-icon">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-menu-icon"><g> <path d="M12 8 L 18 12 L 12 16Z"></path> </g></svg>
                    </div>
                    <div id="cm-this-submenu"> </div>
                </div> -->
                 <div class="menu-item menu-seperator"></div>
                 <div class="menu-item" id="cm-show-trajectory">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text"><u>T</u>rajectory</div>
                </div>
                <div class="menu-item" id="cm-check">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text">Check</div>
                </div>
            </div>
            <div id="box-editor-manager-context-menu">
                <div class="menu-item" id="cm-increase-box-editor">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text">More object instance</div>
                </div>
                <div class="menu-item" id="cm-decrease-box-editor">
                    <div class="menu-item-icon"> </div>
                    <div class="menu-item-text">less object instance</div>
                </div>
            </div>
        </div>
        <div id="config-wrapper">
            <div id="config-menu" class="non-selectable">
                <div class="menu-nonclickable-item" id="cfg-theme">
                    <span>主题</span>
                    <div class="cfg-widget-group">
                        <select type="checkbox" id="cfg-theme-select" class="cfg-widget">
                            <option value="dark" selected>黑暗</option>
                            <option value="light" selected>明亮</option>
                        </select>
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-point-size">
                    <span>点大小</span>
                    <div class='cfg-widget-group'>
                        <div id='cfg-increase-size' class='menu-button'>+</div>
                        <div id='cfg-decrease-size' class='menu-button'>-</div>
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-point-brightness">
                    <span>点亮度</span>
                    <div class='cfg-widget-group'>
                        <div id='cfg-increase-brightness' class='menu-button'>+</div>
                        <div id='cfg-decrease-brightness' class='menu-button'>-</div>
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-hide-circle-ruler">
                    <span>隐藏圆尺</span>
                    <div class="cfg-widget-group">
                        <input type="checkbox" id="cfg-hide-circle-ruler-checkbox" class="cfg-widget" />
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-hide-box">
                    <span>隐藏框</span>
                    <div class="cfg-widget-group">
                        <input type="checkbox" id="cfg-hide-box-checkbox" class="cfg-widget" />
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-hide-id">
                    <span>隐藏ID</span>
                    <div class="cfg-widget-group">
                        <input type="checkbox" id="cfg-hide-id-checkbox" class="cfg-widget" />
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-hide-category">
                    <span>隐藏类别</span>
                    <div class="cfg-widget-group">
                        <input type="checkbox" id="cfg-hide-category-checkbox" class="cfg-widget" />
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-color-points">
                    <span>点颜色</span>
                    <div class="cfg-widget-group">
                        <select type="checkbox" id="cfg-color-points-select" class="cfg-widget">
                            <option value="mono" selected>白色</option>
                            <option value="intensity" selected>高亮</option>
                        </select>
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-color-object">
                    <span>对象颜色</span>
                    <div class="cfg-widget-group">
                        <select id="cfg-color-object-scheme" class="cfg-widget">
                            <option value="category">按类别</option>
                            <option value="id">按id</option>
                            <option value="no">不组合上色</option>
                        </select>
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-menu-batch-mode-inst-number">
                    <span>批处理模式最大箱数</span>
                    <div class="cfg-widget-group">
                        <select title="instance number" id="cfg-batch-mode-inst-number" class="cfg-widget">
                            <option value=10>10</option>
                            <option value=20 selected>20</option>
                            <option value=30>30</option>
                            <option value=40>40</option>
                        </select>
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-coordinate-system">
                    <span>坐标系</span>
                    <div class="cfg-widget-group">
                        <select title="coordinate system" id="cfg-coordinate-system-select" class="cfg-widget">
                            <option value="utm">GPS/UTM</option>
                            <option value="lidar" selected>LiDAR</option>
                        </select>
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-auto-rotate-xy">
                    <span>自动旋转 X/Y（横滚/俯仰）</span>
                    <div class="cfg-widget-group">
                        <input type="checkbox" id="cfg-auto-rotate-xy-checkbox" class="cfg-widget" />
                    </div>
                </div>
                <div class="menu-nonclickable-item" id="cfg-auto-update-interpolated-boxes">
                    <span>自动更新插入框</span>
                    <div class="cfg-widget-group">
                        <input type="checkbox" id="cfg-auto-update-interpolated-boxes-checkbox" class="cfg-widget" />
                    </div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cfg-data">
                    <span>数据设置</span>
                    <div class="menu-item-arrow menu-item-icon">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-menu-icon"> <g> <path d="M12 8 L 18 12 L 12 16Z"></path> </g> </svg>
                    </div>
                    <div id="cfg-data-submenu">
                        <div class="menu-nonclickable-item" id="cfg-data-preload">
                            <div class="menu-item-text">Preload</div>
                            <div class="cfg-widget-group">
                                <input type="checkbox" id="cfg-data-preload-checkbox" class="cfg-widget" />
                            </div>
                        </div>
                        <div class="menu-nonclickable-item" id="cfg-data-aux-lidar">
                            <div class="menu-item-text">Auxiliary LiDAR</div>
                            <div class="cfg-widget-group">
                                <input type="checkbox" id="cfg-data-aux-lidar-checkbox" class="cfg-widget" />
                            </div>
                        </div>
                        <div class="menu-nonclickable-item" id="cfg-data-radar">
                            <div class="menu-item-text">Radar</div>
                            <div class="cfg-widget-group">
                                <input type="checkbox" id="cfg-data-radar-checkbox" class="cfg-widget" />
                            </div>
                        </div>
                        <div class="menu-nonclickable-item" id="cfg-data-filter-points">
                            <div class="menu-item-text">Hide points</div>
                            <div class="cfg-widget-group">
                                <input type="checkbox" id="cfg-data-filter-points-checkbox" class="cfg-widget" />
                                <span> z-threshold</span>
                                <input id="cfg-data-filter-points-z" class="cfg-widget" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="menu-item" id="cfg-experimental">
                    <span>实验的</span>
                    <div class="menu-item-arrow menu-item-icon">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-menu-icon"> <g> <path d="M12 8 L 18 12 L 12 16Z"></path> </g> </svg>
                    </div>
                    <div id="cfg-experimental-submenu">
                        <div class="menu-nonclickable-item" id="cfg-calib-camera-LiDAR">
                            <div class="menu-item-text">Camera-LiDAR calibration</div>
                            <div class='cfg-widget-group'>
                                <div id='cfg-start-calib' class='menu-button'>start</div>
                                <div id='cfg-show-calib' class='menu-button'>result</div>
                                <div id='cfg-stop-calib' class='menu-button'>stop</div>
                                <!-- <div id='cfg-reset-calib' class='menu-button'>reset</div> -->
                            </div>
                        </div>
                        <div class="menu-item" id="cfg-crop-scene">
                            <div class="menu-item-text">Crop scene</div>
                        </div>
                    </div>
                </div>
                <div class="menu-item menu-seperator"></div>
                <div class="menu-item" id="cfg-show-log">
                    <span>显示日志</span>
                </div>
                <div class="menu-item" id="cfg-take-screenshot">
                    <span>截取屏幕截图</span>
                </div>
                <div class="menu-item" id="cfg-help">
                    <a href="https://github.com/naurril/SUSTechPOINTS/blob/dev-auto-annotate/README_guide.md" target="_blank">Help</a>
                </div>
            </div>
        </div>
        <!-- div id="projective-view-context-menu"> <div class="menu-item menu-seperator"></div> <div class="menu-item" id="cm-delete"> <div class="menu-item-icon"></div> <div class="menu-item-text">Delete</div> </div> <div class="menu-item menu-seperator"></div> </div -->
        <div id="object-track-wrapper" class="popup-window-wrapper" tabindex="-1">
            <div id="view" class="non-selectable">
                <div id="header">
                    <span id="title"> Trajectory </span>
                    <div id="buttons">
                        <div id="btn-restore" class="ui-button" title="restore">
                            <!-- <span class="ui-icon ui-icon-trash"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <rect x=6 y=6 width=12 height=12></rect> </g> </svg>
                        </div>
                        <div id="btn-maximize" class="ui-button" title="maximize">
                            <!-- <span class="ui-icon ui-icon-trash"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <rect x=4 y=4 width=16 height=16></rect> </g> </svg>
                        </div>
                        <div id="btn-exit" class="ui-button" title="exit">
                            <!-- <span class="ui-icon ui-icon-trash"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M4 4 L 20 20 M 20 4 L 4 20"></path> </g> </svg>
                        </div>
                    </div>
                </div>
                <svg id="object-track-svg" viewbox="0 0 1000 1000" preserveAspectRatio="xMinYMax meet"> <g id="svg-arrows"></g> <g id="svg-scaler"></g> </svg>
            </div>
        </div>
        <div id="info-wrapper" class="popup-window-wrapper" tabindex='-1'>
            <div id="view">
                <div id="header">
                    <span id="title">Info</span>
                    <div id="buttons">
                        <div id="btn-restore" class="ui-button" title="restore">
                            <!-- <span class="ui-icon ui-icon-trash"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <rect x=6 y=6 width=12 height=12></rect> </g> </svg>
                        </div>
                        <div id="btn-maximize" class="ui-button" title="maximize">
                            <!-- <span class="ui-icon ui-icon-trash"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <rect x=4 y=4 width=16 height=16></rect> </g> </svg>
                        </div>
                        <div id="btn-exit" class="ui-button" title="exit">
                            <!-- <span class="ui-icon ui-icon-trash"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M4 4 L 20 20 M 20 4 L 4 20"></path> </g> </svg>
                        </div>
                    </div>
                </div>
                <div id="info-content"></div>
                <div id="info-bottom-buttons">
                    <button id="btn-no">No</button>
                    <button id="btn-yes">Yes</button>
                </div>
            </div>
        </div>
        <div id="crop-scene-wrapper" class="popup-window-wrapper" tabindex='-1'>
            <div id="view">
                <div id="header">
                    <span id="title">Crop scene</span>
                    <div id="buttons">
                        <div id="btn-restore" class="ui-button" title="restore">
                            <!-- <span class="ui-icon ui-icon-trash"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <rect x=6 y=6 width=12 height=12></rect> </g> </svg>
                        </div>
                        <div id="btn-maximize" class="ui-button" title="maximize">
                            <!-- <span class="ui-icon ui-icon-trash"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <rect x=4 y=4 width=16 height=16></rect> </g> </svg>
                        </div>
                        <div id="btn-exit" class="ui-button" title="exit">
                            <!-- <span class="ui-icon ui-icon-trash"></span> -->
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M4 4 L 20 20 M 20 4 L 4 20"></path> </g> </svg>
                        </div>
                    </div>
                </div>
                <div id="content">
                    <div>
                        <!-- <div><span>scene-id:</span><input id="scene-id" /></div> -->
                        <div>
                            <span>desc:</span>
                            <input id="scene-desc" />
                        </div>
                        <div>
                            <span>start time:</span>
                            <input id="scene-start-time" />
                        </div>
                        <div>
                            <span>seconds:</span>
                            <input id="scene-seconds" />
                        </div>
                        <div>
                            <button id="btn-generate">generate</button>
                        </div>
                        <div id="log"> </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="log-wrapper" class="popup-window-wrapper" tabindex='-1'>
            <div id="view">
                <div id="header">
                    <span id="title">Output</span>
                    <div id="buttons">
                        <!-- <div id="btn-restore" class="ui-button"  title="restore"> <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"><g> <rect x = 6 y = 6 width=12 height=12></rect> </g></svg> </div> <div id="btn-maximize" class="ui-button"  title="maximize"> <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"><g> <rect x = 4 y = 4 width=16 height=16></rect> </g></svg> </div> -->
                        <div id="btn-clear" class="ui-button" title="clear logs">
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <circle cx=12 cy=12 r=8 /> <polyline points="7 7 17 17" /> </g> </svg>
                        </div>
                        <div id="btn-exit" class="ui-button" title="exit">
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M4 4 L 20 20 M 20 4 L 4 20"></path> </g> </svg>
                        </div>
                    </div>
                </div>
                <div id="tabs">
                    <div id="tab-log" class="tab-button tab-selected">Logs</div>
                    <div id="tab-error" class="tab-button">Errors</div>
                </div>
                <div id="content-logs"> </div>
                <div id="content-errors"> </div>
            </div>
        </div>
        <div id="move-handle-wrapper">dialog-wrapper</div>
        <div id="dialog-wrapper" tabindex='-1'>
            <div id="dialog-main">
                <div id="dialog-header">
                    <span id="dialog-title">警告</span>
                    <div id="dialog-buttons">
                        <div id="dialog-exit" class="ui-button" title="exit">
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="svg-button"> <g> <path d="M4 4 L 20 20 M 20 4 L 4 20"></path> </g> </svg>
                        </div>
                    </div>
                </div>
                <div id="dialog-content">
                    <div id="dialog-text"> 清空当前标注, 应用上一帧标注, 确定吗? </div>
                    <div id="dialog-answer">
                        <div id="btn-no" class="dialog-button">取消</div>
                        <div id="btn-yes" class="dialog-button">确定</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`
