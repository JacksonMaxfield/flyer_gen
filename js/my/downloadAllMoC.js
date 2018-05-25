function downloadAllMoC() {
    console.log("starting json creation");

    let allMoCs = firebaseDB.ref("/mocData/").once("value").then(function(snapshot) {

      console.log("json pull complete");

      let str = JSON.stringify(snapshot);

      let path = "mocs.json";
      let blob = new Blob([str], {type: "text/plain"});

      console.log("created blob");

      saveAs(blob, path);

      console.log("saved blob");

    });
};
