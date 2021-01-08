// Giphy Party!

const btnSearch = document.getElementById("button-search");
const btnRemove = document.getElementById("button-remove");
const msg = document.getElementById("msg");
const divGiphys = document.getElementById("giphy-giphs");

// create a Set to quickly determine if a GiphyId is already selected
const myGiphyIds = new Set();
// create an array that will hold the Id and url for all the displayed Giphys.
const myGiphys = [];

class Giphy {

    constructor() {

        //this.giphys = [];
        this.giphys = {};
        this.giphyIds = new Set();
        this.nbrGiphysAdded = 0;
        //this.nbrGiphysOnPage = 0;

    }


    // saveGiphy(giphyId, giphyUrl) {
    //     this.giphys[giphyId] = giphyUrl;
    // }

    wasGiphySaved(giphyId, giphyUrl) {

        // returns true when giphyId and url were saved
        if (this.giphyIds.has(giphyId)) {
            return false;
        } else {
            this.giphyIds.add(giphyId);
            this.giphys[giphyId] = giphyUrl;
            this.nbrGiphysAdded++;
            this.nbrGiphysOnPage++;

            return true;
        }

    }

    removeGiphy(giphyId) {
        if (this.giphyIds.has(giphyId)) {
            //this.nbrGiphysOnPage--;
            this.giphyIds.delete(giphyId);
            delete this.giphys[giphyId];
        }
    };

    resetAddedCtr() {
        this.nbrGiphysAdded = 0;
    }

    getAddedCtr() {
        return this.nbrGiphysAdded;
    }

    getTotalGiphys() {
        return this.giphyIds.size;
    }

    resetAll() {
        this.giphys = {};
        this.giphyIds.clear();
        this.nbrGiphysAdded = 0;
    }

}

const mg = new Giphy();

function setMessage(inMsg, inMsgIsCritical) {

    // function sets message on ui. error class is used for error messages.
    msg.innerHTML = inMsg;

    if (inMsgIsCritical) {
        msg.classList.add("error");
    }

}


function buildAppendImg(inGiphy) {

    const newImg = document.createElement("img");
    newImg.setAttribute("id", inGiphy.id);
    newImg.setAttribute("src", inGiphy.imgDownsizeMedUrl);
    newImg.classList.add("img-giphy");
    divGiphys.append(newImg);

}


function displayGiphys(inGiphys) {

    // inGiphys is an array of at most 5 giphys with
    //  the id and embed_url values.

    for (let idx = 0; idx < inGiphys.length; idx++) {
        buildAppendImg(inGiphys[idx]);
        // retain the id and url of the displayed image
        myGiphys.push(inGiphys[idx]);
        //mg.saveGiphy(inGiphys[idx].id, inGiphys[idx].imgDownsizeMedUrl);
    }

    // were any giphys added?
    if (mg.getAddedCtr() > 0) {
        setMessage(`${mg.getAddedCtr()} GIPHYs were added to your page. `
            + `There are ${mg.getTotalGiphys()} GIPHYs on your page. `
            + "Click on a single GIPHY to remove it, click on 'Remove all GIPHYs' to remove all GIPHYs.", false);

        //inputSearch.value = '';
        mg.resetAddedCtr();
    }

}


function selectGiphys(inData) {

    // Select giphys for display. Five are selected randomly
    //  when more than 5 exist in inData.

    const outGiphys = [];

    let idx = 0;
    if (inData.length > 0) {
        // we have giphys. 
        if (inData.length > 5) {
            // randomly select 5 for display
            let ctr = 0;
            while (ctr < 5) {

                // build a success message with number of giphys returned / displayed and 
                // to click on individual giphys to remove.

                idx = Math.floor(Math.random() * inData.length)
                if (mg.wasGiphySaved(inData[idx].id, inData[idx].images.downsized_medium.url)) {
                    outGiphys.push({
                        id: inData[idx].id,
                        imgDownsizeMedUrl: inData[idx].images.downsized_medium.url
                    });
                    ctr++;
                }
                // if (myGiphyIds.has(inData[idx].id) == false) {
                //     myGiphyIds.add(inData[idx].id);
                //     outGiphys.push({
                //         id: inData[idx].id,
                //         imgDownsizeMedUrl: inData[idx].images.downsized_medium.url
                //     });
                //     ctr++;
                // }


            }

        } else {
            // use them all
            for (idx = 0; idx < inData.length; idx++) {
                // build a success message with number of giphys returned / displayed and 
                // to click on individual giphys to remove.

                if (mg.wasGiphySaved(inData[idx].id, inData[idx].images.downsized_medium.url)) {
                    outGiphys.push({
                        id: inData[idx].id,
                        imgDownsizeMedUrl: inData[idx].images.downsized_medium.url
                    });
                }

                // if (myGiphyIds.has(inData[idx].id) == false) {
                //     myGiphyIds.add(inData[idx].id);
                //     outGiphys.push({
                //         id: inData[idx].id,
                //         imgDownsizeMedUrl: inData[idx].images.downsized_medium.url
                //     });
                // }
            }
        }
    }

    return outGiphys;

}


async function getGiphyGiphs(inSearch) {

    let fixedSearch = inSearch.split(" ").join("%20");
    try {
        const apiKey = "&api_key=CfuzfKdpvcxCi5w4YYucSvIP4dvaDkOR";
        const url = `http://api.giphy.com/v1/gifs/search?q=${fixedSearch}${apiKey}`;
        const res = await axios.get(url);
        console.dir(res);

        if (res.status = 200) {
            if (res.data.data.length > 0) {
                const selectedGiphys = selectGiphys(res.data.data);
                displayGiphys(selectedGiphys);

            } else {
                // nothing was found
                setMessage("No giphys were found for '" + inSearch + "' &#x1F641;", false)
            }

        } else {
            setMessage("giphy search for '" + inSearch
                + "' was not successful (giphy response code = "
                + res.status + ").", true)
        }

    } catch (e) {
        setMessage("An unexpected error (" + e.message
            + ") happened while connecting to Giphy. Search for '"
            + inSearch + "' was not performed.", true)
    }

}


function clearMessages() {

    msg.innerHTML = "&nbsp;";
    msg.classList.remove("error");

}


btnSearch.addEventListener("click", function (event) {

    event.preventDefault();

    clearMessages();

    const inputSearch = document.getElementById("text-search");


    if (inputSearch.value.trim().length > 0) {
        // something was entered. Let's do it!
        getGiphyGiphs(inputSearch.value.trim());



    }



})


btnRemove.addEventListener("click", function (event) {

    event.preventDefault();

    // Setting innerHTML to '' just seems wrong to clear all images.
    // jQuery to remove all images via $('img.img-giphy').remove();
    //  or a loop to run through myGiphyIds for the Ids
    $('img.img-giphy').remove();

    mg.resetAll();

    // myGiphyIds.clear();

    // for (let ctr = myGiphys.length; ctr > 0; ctr--) {
    //     myGiphys.pop();
    // }

})


// jquery to remove an image when selected
$("#giphy-giphs").on("click", "img", function () {

    // remove the giphy from myGiphyIds set 
    const giphyId = $(this).attr("id");

    mg.removeGiphy(giphyId);

    setMessage(`One GIPHY was removed, ${mg.getTotalGiphys()} remain on your page. `, false);

    $(this).remove();

})


