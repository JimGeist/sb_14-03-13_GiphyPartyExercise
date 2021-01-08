// Giphy Party!

const btnSearch = document.getElementById("button-search");
const btnRemove = document.getElementById("button-remove");
const msg = document.getElementById("msg");
const divGiphys = document.getElementById("giphy-giphs");

class Giphy {

    constructor() {

        // object will contain giphy id and giphy url for giphys loaded on
        //  the page
        this.giphys = {};
        // object provides a quick means of determining if a giphy exists on 
        //  the page
        this.giphyIds = new Set();
        // counter of how many giphys were loaded during the search
        this.nbrGiphysAdded = 0;

    }


    wasGiphySaved(giphyId, giphyUrl) {
        // returns true when giphyId and url were saved
        if (this.giphyIds.has(giphyId)) {
            return false;
        } else {
            this.giphyIds.add(giphyId);
            this.giphys[giphyId] = giphyUrl;
            this.nbrGiphysAdded++;

            this.setLocalStorage(giphyId, giphyUrl, "add");

            return true;
        }

    }

    removeGiphy(giphyId) {
        // removes a Giphy from class storage
        if (this.giphyIds.has(giphyId)) {
            this.giphyIds.delete(giphyId);
            delete this.giphys[giphyId];
            this.setLocalStorage(giphyId, "", "rmv");
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
        // need to clear localStorage first because we need the ids in giphyIds
        //  to clear information for each giphy loaded on the page.
        this.setLocalStorage("", "", "clr");
        this.giphys = {};
        this.giphyIds.clear();
        this.nbrGiphysAdded = 0;

    }

    setLocalStorage(id, url, action) {

        switch (action) {
            case "add":
                localStorage.setItem("giphyPty1-" + id, JSON.stringify({ id, url }));
                // the set needs to convert to an array in order to pass it to local storage.
                localStorage.setItem("giphyPty0-ids", JSON.stringify([...this.giphyIds]));
                break;
            case "rmv":
                localStorage.removeItem("giphyPty1-" + id);
                // the set needs to convert to an array in order to pass it to local storage.
                localStorage.setItem("giphyPty0-ids", JSON.stringify([...this.giphyIds]));
                break;
            case "clr":
                if (this.giphyIds.size > 0) {
                    for (let giphyId of this.giphyIds) {
                        localStorage.removeItem("giphyPty1-" + giphyId);
                    }
                    localStorage.removeItem("giphyPty0-ids")
                }
                break;
        }
    }
}

const myGiphys = new Giphy();


function setMessage(inMsg, inMsgIsCritical) {

    // function sets message on ui. error class is used for error messages.
    msg.innerHTML = inMsg;

    if (inMsgIsCritical) {
        msg.classList.add("text-danger");
    } else {
        msg.classList.add("text-light");
    }


}


function clearMessages() {

    msg.innerHTML = "&nbsp;";
    msg.classList.remove(...["error", "text-danger"]);

}


function buildAppendImg(inGiphy) {

    const newImg = document.createElement("img");
    newImg.setAttribute("id", inGiphy.id);
    newImg.setAttribute("src", inGiphy.url);
    newImg.classList.add("img-giphy");
    divGiphys.append(newImg);

}


function displayGiphys(inGiphys) {

    // inGiphys is an array of at most 5 giphys with
    //  the id and embed_url values.

    for (let idx = 0; idx < inGiphys.length; idx++) {
        buildAppendImg(inGiphys[idx]);
    }

    // were any giphys added to the page?
    if (myGiphys.getAddedCtr() > 0) {
        setMessage(`${myGiphys.getAddedCtr()} GIPHYs were added to your page. `
            + `There are ${myGiphys.getTotalGiphys()} GIPHYs on your page. `
            + "Click on a single GIPHY to remove it, click on 'Remove all GIPHYs' to remove all GIPHYs.", false);
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

                idx = Math.floor(Math.random() * inData.length)
                if (myGiphys.wasGiphySaved(inData[idx].id, inData[idx].images.downsized_medium.url)) {
                    outGiphys.push({
                        id: inData[idx].id,
                        url: inData[idx].images.downsized_medium.url
                    });
                    ctr++;
                }

            }

        } else {
            //  5 or less giphys found in search. Use them all
            for (idx = 0; idx < inData.length; idx++) {

                if (myGiphys.wasGiphySaved(inData[idx].id, inData[idx].images.downsized_medium.url)) {
                    outGiphys.push({
                        id: inData[idx].id,
                        url: inData[idx].images.downsized_medium.url
                    });
                }

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


btnSearch.addEventListener("click", function (event) {

    event.preventDefault();

    clearMessages();
    myGiphys.resetAddedCtr();

    const inputSearch = document.getElementById("text-search");

    if (inputSearch.value.trim().length > 0) {
        // something was entered for search text. Let's do it!
        getGiphyGiphs(inputSearch.value.trim());

    }

})


btnRemove.addEventListener("click", function (event) {

    event.preventDefault();

    // Setting innerHTML to '' just seems wrong to clear all images!
    // jQuery to remove all images via $('img.img-giphy').remove();
    //  or a loop to run through giphyIds for the Ids
    $('img.img-giphy').remove();

    clearMessages();
    myGiphys.resetAll();

})


// jquery to remove an image when selected
$("#giphy-giphs").on("click", "img", function () {

    const giphyId = $(this).attr("id");

    // remove the giphy from class storage
    myGiphys.removeGiphy(giphyId);

    setMessage(`One GIPHY was removed, ${myGiphys.getTotalGiphys()} remain on your page. `, false);

    $(this).remove();

})


// Page Load Event.
$(function () {

    // Once page loads, check localStorage for any giphyPty values.
    // giphyPty0-ids: has the ids for all giphys in localStorage
    // giphyPty1-{giphyId}: an entry in local storage with the id and url exists for 
    //  each giphy on the page. We cannot get these values without valid ids from  
    //  giphyPty0-ids


    const lsGiphyIds = JSON.parse(localStorage.getItem("giphyPty0-ids"));

    if (lsGiphyIds) {

        if (lsGiphyIds.length > 0) {
            // we have an array of giphy Ids. Get the url associated with the id
            const outGiphys = [];
            for (let giphyId of lsGiphyIds) {
                const lsGiphy = JSON.parse(localStorage.getItem("giphyPty1-" + giphyId));
                if (lsGiphy) {
                    // lsGiphy is not null
                    if ((lsGiphy.id) && (lsGiphy.url)) {

                        if (myGiphys.wasGiphySaved(lsGiphy.id, lsGiphy.url)) {
                            outGiphys.push({
                                id: lsGiphy.id,
                                url: lsGiphy.url
                            })
                        }
                    }
                }
            }
            if (outGiphys.length > 0) {
                displayGiphys(outGiphys);
                if (myGiphys.getTotalGiphys() > 0) {

                    if (myGiphys.getTotalGiphys() > 1) {
                        setMessage(`There are ${myGiphys.getTotalGiphys()} GIPHYs on your page. `, false);
                    } else {
                        setMessage(`There is ${myGiphys.getTotalGiphys()} GIPHY on your page. `, false);
                    }

                } else {
                    clearMessages();
                }

            }
        }

    }

});
