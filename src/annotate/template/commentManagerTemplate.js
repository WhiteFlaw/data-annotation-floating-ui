export const commentManagerTemplate = `
<div id="comment-manager-wrapper" class="comment-manager-wrapper">
  <div id="comment-manager-title" class="comment-manager-title">
    <span>质检批注</span>
    <button type="button" id="comment-add-btn">添加批注</button></button>
  </div>
  <div id="comment-manager-content" class="comment-manager-content">
    <ul id="comment-list-title">
      <li><span>-- object --</span><span>-问题详情-</span><span>操作</span></li>
    </ul>
    <ul id="comment-list-items">
    </ul>
  </div>
</div>
<div id="comment-add-dialog" class="comment-add-dialog">
  <div id="comment-add-type">
    <div>
      <input type="radio" name="comment-type" id="common-comment-radio" value="0" checked/>
      <label for="common-comment-radio">共性问题</label>
    </div>
    <div>
      <input type="radio" name="comment-type" id="single-item-comment-radio" value="1" />
      <label for="single-item-comment-radio">个性问题</label>
    </div>
    <div>
      <span id="comment-add-dialog-close" class="comment-add-dialog-close">×</span>
    </div>
  </div>
  <div id="comment-add-form-common">
    <label for="comment-add-text-common">问题描述</label>
    <textarea id="comment-add-text-common" name="comment-add-text-common" rows="8"></textarea>
  </div>
  <div id="comment-add-form-single">
    <div>
      <label for="object-list">Object</label>
      <select id="object-list" name="object-list">
        <option value="">请选择</option>
      </select>
    </div>
    <div>
      <label for="comment-add-text-single">问题描述</label>
      <textarea id="comment-add-text-single" name="comment-add-text-single" rows="6"></textarea>
    </div>
  </div>
  <div id="comment-submit-btn-container">
    <button type="button" id="comment-add-submit-btn-new">保存并新建</button>
    <button type="button" id="comment-add-submit-btn-close">保存并关闭</button>
    <button type="button" id="comment-add-cancel-btn">取消</button>
  </div>
</div>
`
