//
class TreeView {
    constructor(){
        // data
        this.items = [
            {
                name: "w0",
                isGroup: false,
            },
            {
                name: "shib",
                isGroup: true,
                items:[
                   {
                        name: "prod",
                        isGroup: true,
                        items:[
                            {
                                name: "login4",
                                isGroup: false,
                            },
                            {
                                name: "login5",
                                isGroup: false,
                            },
                            {
                                name: "login10",
                                isGroup: false,
                            },
                        ]
                   },
                   {
                        name: "uat",
                        isGroup: true,
                        items:[
                            {
                                name: "login11",
                                isGroup: false,
                            },
                        ]
                   },
                   {
                        name: "dev",
                        isGroup: true,
                        items:[
                            {
                                name: "login6",
                                isGroup: false,
                            },
                            {
                                name: "login8",
                                isGroup: false,
                            },
                        ]
                   },
                ]
            },
            {
                name: "isops",
                isGroup: false,
            },
        ];

        // ui
        this.folderCssClass = "folder";
        this.leafCssClass = "leaf";
        this.folderNameCssClass = "folderName";
        this.leafNameCssClass = "leafName";

        // event
        this.onLeafClick = null;
        this.onFolderClick = null;
    }
    open(parentElement){
        this.parentElement = parentElement;
        this.#createUi(parentElement);
        this.#setupEvents();
    }

    #createUi(parentElement)
    {
        let groups = [{name: "noname", items: this.items, _uiParent_ : parentElement,}]; // a single group at start
        let nextGroups = [];

        while (groups.length !== 0) {
            // for each group
            groups.forEach((group)=>{
                const ulE = document.createElement("ul");
                // for each item in this group
                group.items.forEach((item) => {
                    const liE = document.createElement("li");
                    if (item.isGroup) {
                        liE.classList.add(this.folderCssClass);
                        liE.innerHTML = `<span class=${this.folderNameCssClass}>${item.name}</span>`;
                        item._uiParent_ = liE;
                        nextGroups.push(item);
                    } else {
                        liE.classList.add(this.leafCssClass);
                        liE.innerHTML = `<span class=${this.leafNameCssClass}>${item.name}</span>`;
                    }
                    ulE.append(liE);
                });
                group._uiParent_.append(ulE);
            });

            groups = nextGroups;
            nextGroups = [];
        }
    }

    #setupEvents()
    {
        //group name onclick
        const groupNameEs = document.querySelectorAll("span.folderName");
        groupNameEs.forEach((groupNameE) => {
            groupNameE.addEventListener("click", (e) => {
                groupNameE.parentElement.querySelector('ul').classList.toggle('hidden');
                e.stopPropagation();
                if(this.onFolderClick){
                    this.onFolderClick(groupNameE.innerHTML);
                }
            });
        });

        //leaf name onclick
        const leafNameEs = document.querySelectorAll("span.leafName");
        leafNameEs.forEach((leafNameE) => {
            leafNameE.addEventListener("click", (e) => {
                leafNameEs.forEach((leafNameE) => { leafNameE.classList.remove("selected"); });
                leafNameE.classList.add("selected");
                e.stopPropagation();
                if(this.onLeafClick){
                    this.onLeafClick(leafNameE.innerHTML);
                }
            });
        });
    }
}