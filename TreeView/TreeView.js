//
class TreeView {
    constructor(){
        // data
        const demoJsonData = `
        [
            {
                "name": "server1",
                "isGroup": false,
                "fqdn": "server1.example.com"
            },
            {
                "name": "web servers",
                "isGroup": true,
                "items":
                [
                    {
                        "name": "prod",
                        "isGroup": true,
                        "items":
                        [
                            {
                                "name": "web1",
                                "isGroup": false,
                                "items": []
                            },
                            {
                                "name": "web2",
                                "isGroup": false,
                                "items": []
                            }
                        ]
                    },
                    {
                        "name": "uat",
                        "isGroup": true,
                        "items":
                        [
                            {
                                "name": "web3",
                                "isGroup": false,
                                "items": []
                            }
                        ]
                    }
                ]
            },
            {
                "name": "db servers",
                "isGroup": true,
                "items":
                [
                    {
                        "name": "prod",
                        "isGroup": true,
                        "items":
                        [
                            {
                                "name": "db1",
                                "isGroup": false,
                                "items": []
                            },
                            {
                                "name": "db2",
                                "isGroup": false,
                                "items": []
                            }
                        ]
                    },
                    {
                        "name": "uat",
                        "isGroup": true,
                        "items":
                        [
                            {
                                "name": "db3",
                                "isGroup": false,
                                "items": []
                            }
                        ]
                    }
                ]
            },
            {
                "name": "server2",
                "isGroup": false
            }
        ]
        `;
        // load demo data
        this.loadJsonData(demoJsonData);

        // css class names 
        this.folderCssClass = "xq-tree-folder";
        this.leafCssClass = "xq-tree-leaf";
        this.folderNameCssClass = "xq-tree-folderName";
        this.leafNameCssClass = "xq-tree-leafName";
        this.hiddenCssClass = "xq-tree-hidden";
        this.selectedCssClass = "xq-selected";

        // event
        this.onLeafClick = null;
        this.onFolderClick = null;
    }
    loadJsonData(jsonData) {
        this.items = JSON.parse(jsonData);
    }

    open(parentElement) {
        this.parentElement = parentElement;
        this.#createUi(parentElement);
        this.#setupEvents();
    }

    #createUi(parentElement) {
        let groups = [{ name: "noname", items: this.items, _uiParent_: parentElement, }]; // a single group at start
        let nextGroups = [];

        while (groups.length !== 0) {
            // for each group
            groups.forEach((group) => {
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

    #setupEvents() {
        //group name onclick
        const groupNameEs = document.querySelectorAll(`span.${this.folderNameCssClass}`);
        groupNameEs.forEach((groupNameE) => {
            groupNameE.addEventListener("click", (e) => {
                groupNameE.parentElement.querySelector('ul').classList.toggle(this.hiddenCssClass);
                e.stopPropagation();
                if (this.onFolderClick) {
                    this.onFolderClick(groupNameE.innerHTML);
                }
            });
        });

        //leaf name onclick
        const leafNameEs = document.querySelectorAll(`span.${this.leafNameCssClass}`);
        leafNameEs.forEach((leafNameE) => {
            leafNameE.addEventListener("click", (e) => {
                leafNameEs.forEach((leafNameE) => { leafNameE.classList.remove(this.selectedCssClass); });
                leafNameE.classList.add(this.selectedCssClass);
                e.stopPropagation();
                if (this.onLeafClick) {
                    this.onLeafClick(leafNameE.innerHTML);
                }
            });
        });
    }
}