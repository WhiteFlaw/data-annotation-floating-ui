
class LabelPanel {
    constructor(parentUi, data, onCategoryUseChanged, onTrunkUseChanged, onOcclUseChanged) {

        const template = document.getElementById("label-panel-ui-template");
        const labelPanel = template.content.cloneNode(true);
        parentUi.appendChild(labelPanel);

        this.data = data;
        this.ui = parentUi.lastElementChild;

        this.onCategoryUseChanged = onCategoryUseChanged;
        this.onTrunkUseChanged = onTrunkUseChanged;
        this.onOcclUseChanged = onOcclUseChanged;

        this.trunkUseUi = this.ui.querySelector('#if-default-trunk-use');
        this.categoryUseUi = this.ui.querySelector('#if-default-category-use');
        this.occlUseUi = this.ui.querySelector('#if-default-occlusion-use');

        this.trunkUseUi.onchange = () => { this.onTrunkUseChanged(); }; // enable default attribute
        this.categoryUseUi.onchange = () => { this.onCategoryUseChanged(); }; // enable default category
        this.occlUseUi.onchange = () => { this.onOcclUseChanged(); }; // enable default category
    }
};

export { LabelPanel }