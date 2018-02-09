// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.

// 1. Define route components.
// These can be imported from other files

const EntranceComponent = {
  data: function() {
    return {
        dataIsLoaded: false,
        linkContainer: {
            display: "flex",
            width: "80%",
            margin: "100px 10%",
            flexWrap: "wrap"
        },
        headerContainer: {
            width: "100%",
            height: "40px",
            backgroundColor: "#4DAADF",
            textAlign: "left"
        },
        headerText: {
            lineHeight: "44x",
            fontFamily: "Raleway, sans-serif",
            fontSize: "30px",
            fontWeight: "bold",
            color: "white",
            margin: "0px",
            padding: "2px 20px"
        }
    };
  },
  firebase: function() {
    return {
      memberData: {
        source: firebaseDB.ref("/mocData/"),
        asObject: true,
        cancelCallback: function() {
          console.log("Data pull for all members failed...");
        },
        readyCallback: function() {
          console.log("Data pull for all members complete");
          this.dataIsLoaded = true;
        }
      }
    };
  },
  template: `
    <div>
        <div v-bind:style="headerContainer">
            <h2 v-bind:style="headerText">Missing Member Flyers</h2>
        </div>

        <div v-if="dataIsLoaded" v-bind:style="linkContainer">
          <div v-for="(value, key, index) in memberData">
            <member-link v-if="value.in_office" v-bind:memberData="value"></member-link>

          </div>
        </div>
    </div>`
};

Vue.component("member-link", {
    props: ["memberData"],
    data: function() {
        return {
            objectStyle: {
                width: "200px",
                margin: "20px",
                padding: "20px",
                border: "1px solid grey",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)"
            },
            hoverStyle: {
                width: "200px",
                margin: "20px",
                padding: "20px",
                border: "1px solid grey",
                borderRadius: "6px",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
                cursor: "pointer"
            },
            nameStyle: {
                fontFamily: "Raleway, sans-serif",
                fontWeight: "bold",
                margin: "0px"
            },
            stateStyle: {
                fontFamily: "Raleway, sans-serif",
                fontWeight: "light",
                margin: "10px 0px 0px 0px"
            },
            hover: false
        };
    },
    methods: {
      routeToMember: function() {
        this.$router.push("m=" + this.memberData["govtrack_id"]);
      }
    },
    template: `
        <div v-if="hover" v-on:mouseleave="hover = !hover" v-bind:style="hoverStyle" v-on:click="routeToMember">
            <h3 v-bind:style="nameStyle">{{memberData.displayName}}</h3>
            <p v-bind:style="stateStyle">{{memberData.stateName}}</p>
        </div>
        <div v-else v-on:mouseenter="hover = !hover" v-bind:style="objectStyle">
            <h3 v-bind:style="nameStyle">{{memberData.displayName}}</h3>
            <p v-bind:style="stateStyle">{{memberData.stateName}}</p>
        </div>`
});

const MemberViewComponent = {
  props: ["memberId"],
  data: function() {
    return {
        memberIsLoaded: false,
        canvasStyle: {
            display: "none",
            height: "2458px",
            width: "1708px"
        },
        headerContainer: {
            width: "100%",
            height: "40px",
            backgroundColor: "#4DAADF",
            textAlign: "left"
        },
        headerText: {
            lineHeight: "44x",
            fontFamily: "Raleway, sans-serif",
            fontSize: "30px",
            fontWeight: "bold",
            color: "white",
            margin: "0px",
            padding: "2px 20px",
            cursor: "pointer"
        },
        downloadStyle: {
            height: "40px",
            width: "350px",
            padding: "20px",
            margin: "40px 40px",
            backgroundColor: "#FF544B",
            borderRadius: "6px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.35)",
            cursor: "pointer"
        },
        downloadHover: {
            height: "40px",
            width: "350px",
            padding: "20px",
            margin: "40px 40px",
            backgroundColor: "#FF544B",
            borderRadius: "6px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
            cursor: "pointer"
        },
        downloadText: {
            fontColor: "white",
            fontSize: "30px",
            padding: "5px 0px",
            textDecoration: "none",
            fontFamily: "Montserrat, sans-serif"
        },
        downloadReady: false,
        hover: false
    };
  },
  firebase: function() {
    return {
      memberData: {
        source: firebaseDB.ref("/mocData/" + this.memberId + "/"),
        asObject: true,
        cancelCallback: function() {
          console.log("Data pull for " + this.memberId + " failed...");
        },
        readyCallback: function() {
          console.log("Data pull for " + this.memberId + " complete");
          this.memberIsLoaded = true;
        }
      }
    };
  },
  computed: {
      downloadLabel: function() {
          if (this.downloadReady) {
              return "Download Flyer Image";
          } else {
              return "Generate Flyer Image";
          }
      }
  },
  methods: {
    generateAndLinkDownloadOptions: function() {
      html2canvas(document.getElementById("targetFlyer"), {
        useCORS: true
      }).then(function(canvas) {
        let img = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, "data:application/octet-stream");

        let link = document.getElementById("imageDownloadButton");
        link.download = ("missing_member_flyer.png");
        link.href = img;
      });

      this.downloadReady = true;
    },
    returnHome: function() {
        this.$router.push("/");
    }
  },
  template: `
    <div>
        <div v-bind:style="headerContainer">
            <h2 v-on:click="returnHome" v-bind:style="headerText">Missing Member Flyers</h2>
        </div>

        <div v-if="hover" v-on:mouseleave="hover = !hover"  v-bind:style="downloadHover">
            <a id="imageDownloadButton" v-bind:style="downloadText"  v-on:click="generateAndLinkDownloadOptions">{{downloadLabel}}</a>
        </div>
        <div v-else v-on:mouseenter="hover = !hover" v-bind:style="downloadStyle">
            <a id="imageDownloadButton" v-bind:style="downloadText"  v-on:click="generateAndLinkDownloadOptions">{{downloadLabel}}</a>
        </div>

        <div v-if="memberIsLoaded">
            <flyer v-bind:id="'targetFlyer'" v-bind:memberData="memberData"></flyer>
            <canvas v-bind:id="'targetCanvas'" v-bind:style="canvasStyle"></canvas>
        </div>
        <div v-else>
            <p>loading flyer...</p>
        </div>
    </div>`
};

Vue.component("flyer", {
  props: ["memberData"],
  data: function() {
    return {
      styleObject: {
        backgroundColor: "white",
        border: "4px solid grey",
        textAlign: "center",
        height: "2250px",
        width: "1500px",
        margin: "0px",
        position: "relative"
      },
      paddingBox: {
        backgroundColor: "white",
        textAlign: "center",
        width: "1508px",
        margin: "0px",
        padding: "100px"
      }
    };
  },
  computed: {
    partyColor: function() {
      // if (this.memberData.party === "Democrat") {
      //   return "#4DAADF";
      // } else if (this.memberData.party === "Republican") {
      //   return "#FF544B";
      // } else {
      //   return "#8EFF4B";
      // }
      return "#4DAADF";
    },
    flyerMemberLabel: function() {
      let message = "";

      if (this.memberData.type === "sen") {
        message += this.memberData.stateName;
        message += "'s ";
        message += "senator";

      } else {
        message += this.memberData.stateName;
        message += "'s ";

        if (this.memberData.district.toUpperCase() == "AT-LARGE") {
          message += "1";
        } else {
          message += this.memberData.district;
        }

        if (this.memberData.district > 3) {
          message += "th ";
        } else if (this.memberData.district == 3) {
          message += "rd ";
        } else if (this.memberData.district == 2) {
          message += "nd ";
        } else {
          message += "st ";
        }

        message += "congressional district";
      }

      return message.toUpperCase();
    }
  },
  template: `
    <div v-bind:style="paddingBox">
      <div v-bind:style="styleObject">
        <div>
          <flyer-header v-bind:textColor="partyColor"></flyer-header>
          <flyer-label v-bind:heldTownhall="memberData.missingMember"></flyer-label>
          <flyer-name v-bind:type="memberData.type" v-bind:displayName="memberData.displayName"></flyer-name>
          <flyer-image v-bind:govtrackid="memberData.govtrack_id" v-bind:borderColor="partyColor"></flyer-image>
          <flyer-district v-bind:displayMessage="flyerMemberLabel"></flyer-district>
          <flyer-cta v-bind:displayName="memberData.displayName" v-bind:phone="memberData.phone" v-bind:divColor="partyColor"></flyer-cta>
          <flyer-footer v-bind:textColor="partyColor"></flyer-footer>
        </div>
      </div>
    </div>`
});

Vue.component("flyer-header", {
  props: ["textColor"],
  data: function() {
    return {
      styleObject: {
        backgroundColor: "white",
        color: this.textColor,
        fontSize: "108px",
        lineHeight: "108px",
        textAlign: "center",
        margin: "0px",
        paddingLeft: "40px",
        paddingRight: "40px",
        position: "absolute",
        top: "-72px",
        left: "50%",
        webkitTransform: "translateX(-50%)",
        transform: "translateX(-50%)"
      }
    };
  },
  template: `
    <h1 v-bind:style="styleObject" class="montserrat">MISSING&nbsp;MEMBER<br>OF&nbsp;CONGRESS</h1>`
});

Vue.component("flyer-label", {
  props: ["missingMember"],
  data: function() {
    return {
      styleObject: {
        borderTop: "16px solid grey",
        borderBottom: "16px solid grey",
        color: "grey",
        fontSize: "56px",
        fontWeight: "400",
        lineHeight: "68px",
        textAlign: "center",
        margin: "auto",
        marginTop: "180px",
        width: "75%"
      }
    };
  },
  template: `
    <h3 v-bind:style="styleObject" class="raleway"><b>ZERO</b>&nbsp;IN-PERSON&nbsp;TOWN&nbsp;HALLS&nbsp;SINCE&nbsp;JAN,&nbsp;1&nbsp;2017</h3>`
});

Vue.component("flyer-name", {
  props: ["type", "displayName"],
  data: function() {
    return {
      styleObject: {
        color: "grey",
        fontSize: "80px",
        lineHeight: "100px",
        textAlign: "center",
        margin: "auto",
        marginTop: "40px",
        width: "80%"
      },
      reducedStyle: {
        color: "grey",
        fontSize: "68px",
        lineHeight: "100px",
        textAlign: "center",
        margin: "auto",
        marginTop: "40px",
        width: "80%"
      },
      veryReduced: {
        color: "grey",
        fontSize: "54px",
        lineHeight: "100px",
        textAlign: "center",
        margin: "auto",
        marginTop: "40px",
        width: "80%"
      }
    };
  },
  computed: {
    trueStyle: function() {
      if (this.displayName.length > 14) {
        return this.reducedStyle;
      } else if (this.displayName.length > 20) {
        return this.veryReduced;
      } else {
        return this.styleObject;
      }
    }
  },
  template: `<h3 v-bind:style="trueStyle" class="montserrat">{{type.toUpperCase()}}.&nbsp;{{displayName.toUpperCase()}}</h3>`
});

Vue.component("flyer-image", {
  props: ["govtrackid", "borderColor"],
  data: function() {
    return {
      styleObject: {
        display: "block",
        webkitFilter: "grayscale(100%)",
        filter: "grayscale(100%)",
        height: "1000px",
        margin: "0px"
      },
      borderObject: {
        display: "inline-block",
        borderWidth: "12px",
        borderStyle: "solid",
        borderColor: this.borderColor,
        margin: "auto",
        marginTop: "20px"
      }
    };
  },
  computed: {
    imagePath: function() {
      return ("resources/" + this.govtrackid + ".jpg");
    }
  },
  template: `
    <div v-bind:style="borderObject">
      <img v-bind:src="imagePath" v-bind:style="styleObject"></img>
    </div>`
});

Vue.component("flyer-district", {
  props: ["displayMessage"],
  data: function() {
    return {
      styleObject: {
        color: "grey",
        fontSize: "80px",
        lineHeight: "92px",
        margin: "0px",
        marginTop: "40px"
      },
      widthStyle: {
        width: '80%',
        margin: 'auto'
      }
    };
  },
  template: `
    <div v-bind:style="widthStyle">
      <h3 v-bind:style="styleObject" class="montserrat">{{displayMessage}}</h3>
    </div>`
});

Vue.component("flyer-cta", {
  props: ["displayName", "phone", "divColor"],
  data: function() {
    return {
      styleObject: {
        width: "80%",
        margin: "auto",
        marginTop: "40px"
      },
      textStyle: {
        color: "grey",
        display: "inline-block",
        fontSize: "56px",
        fontWeight: "400",
        lineHeight: "68px",
        margin: "0px"
      },
      divStyle: {
        backgroundColor: this.divColor,
        height: "8px",
        width: "100%",
        margin: "0px",
        marginTop: "20px",
        marginBottom: "20px"
      }
    };
  },
  template: `
    <div v-bind:style="styleObject" class="raleway">
      <h4 v-bind:style="textStyle"><b>Call&nbsp;and&nbsp;ask&nbsp;{{displayName}}<br>to&nbsp;have&nbsp;a&nbsp;town&nbsp;hall:&nbsp;{{phone}}</b></h4>
      <div v-bind:style="divStyle"></div>
      <h4 v-bind:style="textStyle">Get&nbsp;town&nbsp;hall&nbsp;and&nbsp;other&nbsp;event&nbsp;notifications&nbsp;at<br><b>townhallproject.com</b></h4>
    </div>`
});

Vue.component("flyer-footer", {
  props: ["textColor"],
  data: function() {
    return {
      styleObject: {
        backgroundColor: "white",
        margin: "0px",
        paddingLeft: "40px",
        paddingRight: "40px",
        position: "absolute",
        bottom: "-120px",
        left: "50%",
        webkitTransform: "translateX(-50%)",
        transform: "translateX(-50%)"
      },
      iconStyleObject: {
        display: "inline-block",
        marginRight: "40px",
        height: "144px",
        width: "144px"
      },
      textStyleObject: {
        display: "inline-block",
        color: this.textColor,
        fontSize: "72px",
        lineHeight: "72px",
        textAlign: "left",
      }
    };
  },
  template: `
    <div v-bind:style="styleObject">
      <img v-bind:src="'resources/icon.png'" v-bind:style="iconStyleObject">
      <h2 v-bind:style="textStyleObject" class="montserrat">TOWN&nbsp;HALL<br>PROJECT</h2>
    </div>`
});

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We"ll talk about nested routes later.

const routes = [
  { path: "/",
    component: EntranceComponent
  },
  { path: "/m=:memberId",
    component: MemberViewComponent,
    props: true
  },
  { path: "*",
    redirect: "/"
  }
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let"s
// keep it simple for now.

const router = new VueRouter({
  routes // short for `routes: routes`
});

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.

const app = new Vue({
  router
}).$mount("#app");

// Now the app has started!
