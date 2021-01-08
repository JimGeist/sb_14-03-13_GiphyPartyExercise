// Giphy Party!

const btnSearch = document.getElementById("button-search");
const btnRemove = document.getElementById("button-remove");
const msg = document.getElementById("msg");
const divGiphys = document.getElementById("giphy-giphs");

// create a Set to quickly determine if a GiphyId is already selected
const myGiphyIds = new Set();
// create an array that will hold the Id and url for all the displayed Giphys.
const myGiphys = [];


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
                if (myGiphyIds.has(inData[idx].id) == false) {
                    myGiphyIds.add(inData[idx].id);
                    outGiphys.push({
                        id: inData[idx].id,
                        imgDownsizeMedUrl: inData[idx].images.downsized_medium.url
                    });
                    ctr++;
                }
            }

        } else {
            // use them all
            for (idx = 0; idx < inData.length; idx++) {
                if (myGiphyIds.has(inData[idx].id) == false) {
                    myGiphyIds.add(inData[idx].id);
                    outGiphys.push({
                        id: inData[idx].id,
                        imgDownsizeMedUrl: inData[idx].images.downsized_medium.url
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

    //inputSearch.value = '';

})


btnRemove.addEventListener("click", function (event) {

    event.preventDefault();

    // Setting innerHTML to '' just seems wrong to clear all images.
    // jQuery to remove all images via $('img.img-giphy').remove();
    //  or a loop to run through myGiphyIds for the Ids
    $('img.img-giphy').remove();

    myGiphyIds.clear();

    for (let ctr = myGiphys.length; ctr > 0; ctr--) {
        myGiphys.pop();
    }

})


// jquery to remove an image if selected
$("#giphy-giphs").on("click", "img", function () {

    // remove the giphy from myGiphyIds set 
    const giphyId = $(this).attr("id");
    myGiphyIds.delete(giphyId);

    // // remove the giphy from myGiphys array.
    // myGiphys = myGiphys.filter(function (value, array, idx) {
    //     return value.id !== giphyId;
    // })

    $(this).remove();
})


