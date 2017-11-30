// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.

// 1. Define route components.
// These can be imported from other files

const EntranceComponent = {
  data: function() {
    return {
      repList: {
        "jayapal" : {
          "body" : "House of Representative's",
          "fullName" : "Pramila Jayapal",
          "phone" : "202-225-3106",
          "photo" : "../../resources/jayapal.jpg",
          "state" : "Washington",
          "district" : 7,
          "party" : "Democrat",
          "townhallCount" : 2
        },
        "reichert" : {
          "body" : "House of Representative's",
          "fullName" : "Dave Reichert",
          "phone" : "202-225-7761",
          "photo" : "../../resources/reichert.jpg",
          "state" : "Washington",
          "district" : 8,
          "party" : "Republican",
          "townhallCount" : 0
        }
      }
    };
  },
  template: `
    <div>
      <p>Entered Main</p>
      <image-link
      v-for="(item, key, index) in repList"
      v-bind:key="index"
      v-bind:objectDetails="item"
      v-bind:height="300"
      v-bind:width="200"
      v-bind:routeTarget="('m=' + key)"
      ></image-link>
    </div>`
};

Vue.component("image-link", {
  props: ["objectDetails", "height", "width", "routeTarget"],
  methods: {
    routeToTarget: function() {
      this.$router.push(this.routeTarget);
    }
  },
  template: `
    <div>
      <img
      v-bind:src="objectDetails.photo"
      v-bind:height="height"
      v-bind:width="width"
      v-on:click="routeToTarget"
      >
      <p>{{routeTarget}}</p>
    </div>`
});

const StateViewComponent = {
  props: ["state"],
  template: `
    <div>
      <p>Entered StateView for: {{state}}</p>
    </div>`
};

const MemberViewComponent = {
  props: ["member"],
  data: function() {
    return {
      repList: {
        "jayapal" : {
          "body" : "House of Representative's",
          "fullName" : "Pramila Jayapal",
          "phone" : "202-225-3106",
          "photo" : "../../resources/jayapal.jpg",
          "state" : "Washington",
          "district" : 7,
          "party" : "Democrat",
          "townhallCount" : 2
        },
        "reichert" : {
          "body" : "House of Representative's",
          "fullName" : "Dave Reichert",
          "phone" : "202-225-7761",
          "photo" : "../../resources/reichert.jpg",
          "state" : "Washington",
          "district" : 8,
          "party" : "Republican",
          "townhallCount" : 0
        }
      },
      canvasStyle: {
        display: "none",
        height: "2458px",
        width: "1708px"
      }
    };
  },
  firebase: function() {
    return {
      events: {
        source: firebaseDB.ref("/events/"),
        asObject: true,
        cancelCallback: function() {
          console.log("Data pull for events failed...");
        },
        readyCallback: function() {
          console.log("Data pull and sort for events complete");
          this.eventsAreLoaded = true;
        }
      }
    };
  },
  computed: {
    memberData: function() {
      return this.repList[this.member];
    }
  },
  methods: {
    generateAndLinkDownloadOptions: function() {
      // let canvas = document.getElementById("targetCanvas");
      // let context = canvas.getContext("2d");
      // let imgHTML = document.getElementById("targetFlyer");
      // let options = {
      //   height: imgHTML.offsetHeight,
      //   width: imgHTML.offsetWidth
      // };
      //
      // rasterizeHTML.drawHTML(imgHTML.outerHTML).then(function(renderResult) {
      //   context.drawImage(renderResult.image, 0, 0);
      // });
      //
      // let img = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      // let link = document.getElementById("imageDownloadButton");
      // link.download = "missing_member_flyer.png";
      // link.href = img;

      html2canvas(document.getElementById("targetCanvas"), {
  		  onrendered: function(canvas) {
          let img = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

          let link = document.getElementById("imageDownloadButton");
          link.download = ("missing_member_flyer.png");
          link.href = img;
  		  }
  		});
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.generateAndLinkDownloadOptions();
    });
  },
  template: `
    <div>
      <p>Entered MemberView for: {{member}}</p>
      <p>{{memberData}}</p>
      <a id="imageDownloadButton" v-on:click="generateAndLinkDownloadOptions">Download Flyer Image</a>
      <flyer v-bind:id="'targetFlyer'" v-bind:memberData="memberData"></flyer>
      <canvas v-bind:id="'targetCanvas'" v-bind:style="canvasStyle"></canvas>
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
    townhallCountWord: function() {
      let counts = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

      return counts[this.memberData.townhallCount];
    },
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

      if (this.memberData.body === "House of Representative's") {
        message += this.memberData.state;
        message += "'s ";
        message += this.memberData.district;

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
      } else {
        message += this.memberData.state;
        message += "'s ";
        message += "senator";
      }

      return message.toUpperCase();
    }
  },
  template: `
    <div v-bind:style="paddingBox">
      <div v-bind:style="styleObject">
        <div>
          <flyer-header v-bind:textColor="partyColor"></flyer-header>
          <flyer-label v-bind:townhallCount="townhallCountWord"></flyer-label>
          <flyer-name v-bind:body="memberData.body" v-bind:fullName="memberData.fullName"></flyer-name>
          <flyer-image v-bind:imagePath="memberData.photo" v-bind:borderColor="partyColor"></flyer-image>
          <flyer-district v-bind:displayMessage="flyerMemberLabel"></flyer-district>
          <flyer-cta v-bind:fullName="memberData.fullName" v-bind:phone="memberData.phone" v-bind:divColor="partyColor"></flyer-cta>
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
  props: ["townhallCount"],
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
    <h3 v-bind:style="styleObject" class="raleway"><b>{{townhallCount.toUpperCase()}}</b>&nbsp;IN-PERSON&nbsp;TOWN&nbsp;HALLS&nbsp;IN&nbsp;2017</h3>`
});

Vue.component("flyer-name", {
  props: ["body", "fullName"],
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
      }
    };
  },
  computed: {
    memType: function() {
      if (this.body === "House of Representative's") {
        return "Rep.";
      } else if (this.body === "Senate") {
        return "Sen.";
      } else {
        return "Err.";
      }
    }
  },
  template: `<h3 v-bind:style="styleObject" class="montserrat">{{memType.toUpperCase()}}&nbsp;{{fullName.toUpperCase()}}</h3>`
});

Vue.component("flyer-image", {
  props: ["imagePath", "borderColor"],
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
      }
    };
  },
  template: `<h3 v-bind:style="styleObject" class="montserrat">{{displayMessage}}</h3>`
});

Vue.component("flyer-cta", {
  props: ["fullName", "phone", "divColor"],
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
      <h4 v-bind:style="textStyle"><b>Call&nbsp;and&nbsp;ask&nbsp;{{fullName}}<br>to&nbsp;have&nbsp;a&nbsp;town&nbsp;hall:&nbsp;{{phone}}</b></h4>
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
  { path: "/s=:state",
    component: StateViewComponent,
    props: true
  },
  { path: "/m=:member",
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
