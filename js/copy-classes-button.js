// STATES

const states = {
  hover: "hover",
  pressed: "active",
  focuskeyboard: "focus-visible",
  focus: "focus",
};


// BREAKPOINT CHECKBOXES

const breakpoints = {
  tiny: "mp",
  small: "ml",
  medium: "tb",
  large: "lg",
  xl: "xl",
  xxl: "xxl"
};

// get all elements with attribute prt-copy-tool="true"
const prtCopyTool = document.querySelectorAll('[prt-copy-tool="true"]');

const utilityGroup = prtCopyTool[0].getAttribute('prt-utility-group');

const version = document.querySelector('[prt-system-version]').getAttribute('prt-system-version');
// fetch css file
fetch(`https://cdn.jsdelivr.net/gh/coco8020/pareto-system@${version}/css/${utilityGroup}.css`)
  .then((response) => response.text())
  .then((data) => {

    prtCopyTool.forEach((element) => {

      // WEBFLOW JSON

      let webflowJSON = {
        type: "@webflow/XscpData",
        payload: {
          nodes: [
            {
              _id: "4309a440-ade2-2a1f-5a96-396a84397c5b",
              type: "Block",
              tag: "div",
              classes: [],
              children: ["4309a440-ade2-2a1f-5a96-396a84397c5c"],
              data: { text: true, tag: "div" }
            },
            {
              _id: "4309a440-ade2-2a1f-5a96-396a84397c5c",
              text: true,
              v: "Classes added."
            }
          ],
          styles: [],
          assets: [],
          ix1: [],
          ix2: { interactions: [], events: [], actionLists: [] }
        },
        meta: {
          unlinkedSymbolCount: 0,
          droppedLinks: 0,
          dynBindRemovedCount: 0,
          dynListBindRemovedCount: 0,
          paginationRemovedCount: 0
        }
      };


      let checkboxes = element.querySelectorAll('[breakpoint-checkbox="true"]');
      // add event listener to checkboxes
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
          if (checkbox.checked) {
            // get breakpoint
            let breakpoint = breakpoints[checkbox.value];
            let nodes = webflowJSON.payload.styles;
            // get nodes with name that start with "u-"
            nodes = nodes.filter((node) => node.name.startsWith("u-"));
            nodes.forEach(function (record) {

              let node

              if (state) {

                let stateProperty = states[state];

                stateProperty = checkbox.value + "_" + stateProperty;

                // create json node
                node = {
                  _id: idCreator(),
                  fake: false,
                  type: "class",
                  name: breakpoint + "--" + record.name,
                  namespace: "",
                  comb: "",
                  styleLess: "",
                  variants: record.variants,
                  children: [],
                  createdBy: "60a00ee3ce4d2f8019c20f88",
                  selector: null
                };

              } else {
                // create json node
                node = {
                  _id: idCreator(),
                  fake: false,
                  type: "class",
                  name: breakpoint + "--" + record.name,
                  namespace: "",
                  comb: "",
                  styleLess: "",
                  variants: {
                    [checkbox.value]: {
                      styleLess: record.styleLess
                    }
                  },
                  children: [],
                  createdBy: "60a00ee3ce4d2f8019c20f88",
                  selector: null
                };
              }

              // add node to webflowJSON
              webflowJSON.payload.styles.push(node);
            });
          } else {
            // find nodes with value in variants
            let nodes = webflowJSON.payload.styles.filter(
              (node) => node.variants[checkbox.value]
            );
            // remove nodes from webflowJSON
            nodes.forEach((node) => {
              let index = webflowJSON.payload.styles.indexOf(node);
              webflowJSON.payload.styles.splice(index, 1);
            });
          }
        });
      });

      // get all elements with attribute prt-system-button regardless of value
      const prtSystemButton = element.querySelector('[prt-system-button]');

      const state = prtSystemButton.getAttribute('prt-system-state');


      // remove all comments
      data = data.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "");
      // remove all new lines
      data = data.replace(/\n/g, "");
      // create array of classes
      let classes = data.split("}");
      // remove last item from array
      classes.pop();
      // loop through classes
      classes.forEach(function (record) {
        // get name value of node
        let name = record.split("{")[0].trim();
        // remove . from name
        name = name.replace(".", "");
        let styleLess = record.split("{")[1].trim();

        let node

        // if state is not null
        if (state) {
          // remove u-- from name
          name = name.replace("u--", "");
          name = state + "-" + name;
          name = "u--" + name;

          let stateProperty = states[state];

          stateProperty = "main_" + stateProperty;

          node = {
            _id: idCreator(),
            fake: false,
            type: "class",
            name: name,
            namespace: "",
            comb: "",
            styleLess: "",
            variants: {
              [stateProperty]: {
                styleLess: styleLess
              }
            },
            children: [],
            createdBy: "60a00ee3ce4d2f8019c20f88",
            selector: null
          }
        } else {
          // create json node
          node = {
            _id: idCreator(),
            fake: false,
            type: "class",
            name: name,
            namespace: "",
            comb: "",
            styleLess: styleLess,
            variants: {},
            children: [],
            createdBy: "60a00ee3ce4d2f8019c20f88",
            selector: null
          };
        }
        // add node to webflowJSON
        webflowJSON.payload.styles.push(node);

        // add event listener to button
        prtSystemButton.addEventListener("click", (event) => {

          event.preventDefault();
          document.addEventListener(
            "copy",
            (event) => {
              let data = JSON.stringify(webflowJSON);
              if (event.clipboardData) {
                event.clipboardData.setData("application/json", data);
              } else if (window.clipboardData) {
                window.clipboardData.setData("application/json", data);
              }
              event.preventDefault();
            },
            true
          );
          document.execCommand("copy");
        });
      });

    });
  });