function wtDecimal(wholeNum){
  if(Number.isSafeInteger(Number(wholeNum))){
    var wholeStr = Number(wholeNum).toString();
    if(wholeNum >= 0){
      if(wholeStr.length == 0){
        return "0,00";
      }else if(wholeStr.length == 1){
        return `0,0${wholeStr}`;
      }else if(wholeStr.length == 2){
        return `0,${wholeStr}`;
      }else{
        return `${wholeStr.slice(0, wholeStr.length-2)},${wholeStr.slice(wholeStr.length-2, wholeStr.length)}`;
      }
    }else{
      if(wholeStr.length < 2){
        return "0,00";
      }else if(wholeStr.length == 2){
        return `-0,0${wholeStr[1]}`;
      }else if(wholeStr.length == 3){
        return `-0,${wholeStr.slice(1, wholeStr.length)}`;
      }else{
        return `-${wholeStr.slice(1, wholeStr.length-2)},${wholeStr.slice(wholeStr.length-2, wholeStr.length)}`;
      }
    }
  }else{
    return "unsupported input";
  }
}

function updatePartPrice(partDom){

  var partPrice = partDom.querySelector(".part-price .price-main");
  var partPriceValue = partPrice.dataset.priceval;
  partPrice.innerHTML = `${wtDecimal(partPriceValue)}€`;
  
  if(!partDom.previousElementSibling.classList.contains("part-rd-bt")){return}

  var selectedPart = partDom.parentElement.querySelector("input.part-rd-bt:checked + div.listed-part");
  var partDifference = partDom.querySelector(".part-price .price-difference");
  if(selectedPart){
    var selectedPriceValue = selectedPart.querySelector(".part-price .price-main").dataset.priceval;
    var result = partPriceValue - selectedPriceValue;
    if(result == 0){
      partDifference.innerHTML = `+0,00€`;
      partDifference.classList.add("price-lower");
      partDifference.classList.remove("price-higher");
    }else if(result < 0){
      partDifference.innerHTML = `${wtDecimal(result)}€`;
      partDifference.classList.add("price-lower");
      partDifference.classList.remove("price-higher");
    }else{
      partDifference.innerHTML = `+${wtDecimal(result)}€`;
      partDifference.classList.add("price-higher");
      partDifference.classList.remove("price-lower");
    }
  }else{
    partDifference.innerHTML = "+0,00€";
    partDifference.classList.remove("price-lower","price-higher");
  }
}

function updateNumberInput(partDom, action="update"){
  var inputHead = partDom.querySelector(".part-number-input");
  if(!inputHead){return;}
  var inputValue = inputHead.querySelector(".part-quantity");
  var inputMin = Number(inputValue.min);
  var inputMax = Number(inputValue.max);
  inputHead.classList.remove("decr-av","incr-av");
  if(!partDom.previousElementSibling.checked){
    inputValue.disabled = true;
    inputValue.value = 0;
  }else{
    inputValue.disabled = false;
    if(inputValue.value < inputMin || inputValue.value > inputMax){
      inputValue.value = inputMin;
    }else if(action == "increment" && inputValue.value < inputMax){
      inputValue.value++;
    }else if(action == "decrement" && inputValue.value > inputMin){
      inputValue.value--;
    }
    if(inputValue.value > inputMin){
      inputHead.classList.add("decr-av");
    }
    if(inputValue.value < inputMax){
      inputHead.classList.add("incr-av");
    }     
  }
  inputHead.querySelector(".quantity-display").innerHTML = inputValue.value;
}

function updateFinalPrice(){
  var objList = document.querySelectorAll(".build-price-total");
  var objListTaxLess = document.querySelectorAll(".build-price-taxless");
  if(!(objList.length || objListTaxLess.length)){return}
  var sum = 0;
  var getSelected = document.querySelectorAll(".builder-part-category input.part-rd-bt:checked, .builder-part-category input.part-checkbox:checked");
  for(let i=0; i < getSelected.length; i++){
    if(getSelected[i].value=="emptyval"){continue}
    var multiplier = getSelected[i].nextElementSibling.querySelector(".part-quantity")?getSelected[i].nextElementSibling.querySelector(".part-quantity").value:1;
    sum += Number(multiplier) * getSelected[i].nextElementSibling.querySelector(".price-main").dataset.priceval;
  }
  for(let i=0; i < objList.length; i++){
    objList[i].innerHTML = wtDecimal(sum);
  }  
  for(let i=0; i < objListTaxLess.length; i++){
    objListTaxLess[i].innerHTML = wtDecimal(Math.floor(sum/1.24));
  }  
}

function updateModal(){
  var modTable = document.querySelector("#build-modal .modal-table");
  if(!modTable){return}
  var tempHTML = `
  <div class="table-row">
  <div class="modal-cat-header">Κατηγορία</div>
  <div class="modal-prnum-header">Κωδικός</div>
  <div class="modal-product-header">Προϊόν</div>
  <div class="modal-quant-header">Τμχ.</div>
  <div class="modal-price-header">Τιμή</div>
  <div class="modal-total-header">Σύνολο</div></div>`;
  var linktext = window.location.href.split('&');
  //linktext = `${linktext[0]}&${linktext[1]}&prefill=1`; //
  linktext = `https://www.msystems.gr/section/systems/?&system=18&prefill=1`;   //temp change
  var getCats = document.querySelectorAll(".builder-parts .builder-part-category");
  var sum = 0;
  for(let i = 0; i< getCats.length; i++){
    var sel_prod = getCats[i].querySelectorAll("input.part-rd-bt:checked, input.part-checkbox:checked");
    if(!sel_prod.length){
      tempHTML+=`<div class="table-row">
        <div class="cat-nm">${getCats[i].querySelector(".part-category-head").innerHTML}</div>
        <div class="erp-pn">-</div>
        <div class="prod-nm">-</div>
        <div class="prod-quant">0x</div>
        <div class="prod-price">0,00 €</div>
        <div class="prod-price-total">0,00 €</div>
        </div>`
      ;
    }
    for(let x = 0; x < sel_prod.length; x++){
      var prod_price = 0;
      var prod_price_total = 0;
      var prod_quant = 0;
      var erp_pn = "-";
      var prod_name = "-";
      prod_name = sel_prod[x].nextElementSibling.querySelector(".part-text-head").innerHTML;
      if(sel_prod[x].value != "emptyval"){
        if(sel_prod[x].dataset.erp){erp_pn = sel_prod[x].dataset.erp;}
        prod_price = sel_prod[x].nextElementSibling.querySelector(".price-main").dataset.priceval;
        prod_quant = sel_prod[x].nextElementSibling.querySelector(".part-number-input .part-quantity");
        if(prod_quant){
          prod_quant = prod_quant.value;
        }else{
          prod_quant = 1;
        }
        prod_price_total = Number(prod_price) * prod_quant;
        sum += prod_price_total;
        linktext += `&o${i}${sel_prod[x].type=="checkbox"?"[]":""}=${sel_prod[x].value}&q${i}${sel_prod[x].type=="checkbox"?"[]":""}=${prod_quant}`;
      }      
      tempHTML+=`<div class="table-row">
        <div class="cat-nm">${getCats[i].querySelector(".part-category-head").innerHTML}</div>
        <div class="erp-pn">${erp_pn}</div>
        <div class="prod-nm">${prod_name}</div>
        <div class="prod-quant">${prod_quant}x</div>
        <div class="prod-price">${wtDecimal(prod_price)} €</div>
        <div class="prod-price-total">${wtDecimal(prod_price_total)} €</div>
        </div>`
      ;
    }
  }
  sum = wtDecimal(sum);
  tempHTML +=`<div class="table-row">
    <div class="modal-total-title">Σύνολο:</div>
    <div></div><div></div><div></div><div></div>
    <div class="modal-total-num"><span>${sum}</span> €</div>
    </div>`
  ;

  modTable.innerHTML = tempHTML;
  document.querySelector("#build-modal .modal-footer .footer-link-body").dataset.geturl = linktext;
  document.querySelector("#build-modal .modal-footer .footer-link-body").innerHTML = "Δημιουργία σύνδεσμου";
}

function initProdNav(){
  var navBody = document.getElementById("prod-navigation");
  if(!navBody){return}
  var getCats = document.querySelectorAll(".builder-parts .builder-part-category");
  var endList = "";
  for(let i = 0;i< getCats.length;i++){
    var nameText = getCats[i].querySelector(".part-category-head").innerText;
    var catTarget = getCats[i].id;   
    // endList += `<div class="prod-navigator" data-navdest="${catTarget}"><i class="bi bi-tools"></i>${nameText}<span>-,--€</span></div>`;
    endList += `<div class="prod-navigator" data-navdest="${catTarget}"><i class="bi bi-slash-circle"></i>${nameText}<i class="bi bi-tools"></i></div>`;
  }
  navBody.innerHTML = endList;
  var navList = navBody.querySelectorAll(".prod-navigator");
  for(let n=0;n<navList.length;n++){
    navList[n].addEventListener("click",function(){catRedirect(getCats[n])});
  }
  updateProdNav();
  updateProdNavSel();
}

function updateProdNav(){
  var navBody = document.getElementById("prod-navigation");
  if(!navBody){return}
  var navList = navBody.querySelectorAll(".prod-navigator");
  for(let i=0;i<navList.length;i++){
    var catTargetDom = document.getElementById(navList[i].dataset.navdest);
    if(catTargetDom.classList.contains("lp-show")){
      navList[i].style.backgroundColor = "#f6f6f6";
    }else{
      navList[i].style.backgroundColor = "";
    }
  }
}
function updateProdNavSel(){
  var navBody = document.getElementById("prod-navigation");
  if(!navBody){return}
  var navList = navBody.querySelectorAll(".prod-navigator");
  for(let i=0;i<navList.length;i++){
    var catTargetDom = document.querySelector(`#${navList[i].dataset.navdest} .part-category-head`);
    if(catTargetDom.classList.contains("contains-selected")){
      navList[i].firstElementChild.outerHTML = '<i class="bi bi-check-circle"></i>';
    }else{
      navList[i].firstElementChild.outerHTML = '<i class="bi bi-slash-circle"></i>';
    }
  }
}

function updatePerfCarousel(forceInit=false){
  var perf_carousel = document.querySelector("#performance-carousel-2");
  if(!perf_carousel){return}
  perfConfig = {
    "dictionary":{
      "lol_game":"League of Legends",
      "fortnite_game":"Fortnite",
      "control_game":"Control",
      "fs2020_game":"MS Flight Simulator 2021",
      "sottr_game":"Shadow of the Tomb Raider",
      "cpu":["Επεξεργαστή"],
      "gpu":["Κάρτα Γραφικών"],
      "required":["Το σύστημα χρειάζεται @@@.", " και ", ", "],
      "perfReady":"Το σύστημα είναι κατάλληλο για @@@ μέχρι ### ανάλυση.",
      "perfNotReady": "Το σύστημα είναι ανεπαρκές για αυτό το παιχνίδι.",
      "recommend": ["<br/>Αλλάξτε @@@ για καλύτερη απόδοση."]
    },
    "gameList":{
      "lol_game":{
        "cType":"normal",
        "img_src":"assets/lol-game.jpg",
        "img_src_wide":"assets/lol-game-wide.jpg",
        "parts":{
          "cpu":{
            "safe":"$",
            "attr": "0"
          },
          "gpu":{
            "safe":"$",
            "attr": "0"
          }          
        }
      },
      "fortnite_game":{
        "cType":"normal",
        "img_src":"assets/fortnite-game.jpg",
        "img_src_wide":"assets/fortnite-game-wide.jpg",
        "parts":{
          "cpu":{
            "safe":"$",
            "attr": "1"
          },
          "gpu":{
            "safe":"$",
            "attr": "1"
          }          
        }
      },
      "control_game":{
        "cType":"normal",
        "img_src":"assets/control-game.jpg",
        "img_src_wide":"assets/control-game-wide.jpg",
        "parts":{
          "cpu":{
            "safe":"$",
            "attr": "2"
          },
          "gpu":{
            "safe":"$",
            "attr": "2"
          }          
        }
      },
      "fs2020_game":{
        "cType":"normal",
        "img_src":"assets/fs2020-game.jpg",
        "img_src_wide":"assets/fs2020-game-wide.jpg",
        "parts":{
          "cpu":{
            "safe":"$",
            "attr": "3"
          },
          "gpu":{
            "safe":"$",
            "attr": "3"
          }          
        }
      },
      "sottr_game":{
        "cType":"normal",
        "img_src":"assets/sottr-game.jpg",
        "img_src_wide":"assets/sottr-game-wide.jpg",
        "parts":{
          "cpu":{
            "safe":"$",
            "attr": "4"
          },
          "gpu":{
            "safe":"$",
            "attr": "4"
          }          
        }
      }
    }
  }
  if(perf_carousel.innerText=="Needs Init"||forceInit){
    var result ='<div style="text-align: center; color: #eabe4b;">Εκτιμώμενη Απόδοση</div><!-- Indicators --><div class="carousel-indicators">';
      for(let i=0;i<Object.keys(perfConfig.gameList).length;i++){
        result += `<button data-bs-target="#performance-carousel-2" data-bs-slide-to="${i}"${!i?' class="active"':""}></button>`;
      }
    result += '</div><!-- The slideshow --><div class="carousel-inner">';
    for (const [game, gConfig] of Object.entries(perfConfig.gameList)){
      result +=`
      <div class="carousel-item${!Object.keys(perfConfig.gameList).indexOf(game)?" active":""}">
        <img src="${gConfig.img_src}" alt="${perfConfig.dictionary[game]}">
        <div class="perf-display" id="perf-${game}">
          ${/*<div class="perf-head">
            <span class="perf-1080p">1080p:&nbsp;<span><i class="bi bi-exclamation-circle-fill"style="color: #eabe4b;font-size: 1.2rem;vertical-align: middle;"></i></span></span>
            <span class="perf-1440p">1440p:&nbsp;<span><i class="bi bi-exclamation-circle-fill"style="color: #eabe4b;font-size: 1.2rem;vertical-align: middle;"></i></span></span>
            <span class="perf-4k">4K:&nbsp;<span><i class="bi bi-exclamation-circle-fill"style="color: #eabe4b;font-size: 1.2rem;vertical-align: middle;"></i></span></span>
    </div>*/""}
          <div class="perf-body">
            Needs Init
          </div>
        </div>
      </div>
      `      
    }    
    result += `
            </div>
            <!-- Left and right controls -->
            <button class="carousel-control-prev" type="button" data-bs-target="#performance-carousel-2"
              data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#performance-carousel-2"
              data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      `
      perf_carousel.innerHTML = result;
      bootstrap.Carousel.getOrCreateInstance(document.querySelector("#performance-carousel-2")).dispose();
      bootstrap.Carousel.getOrCreateInstance(document.querySelector("#performance-carousel-2"));
  }
  var msg = [`<a class="category-link"onclick="catRedirect(document.querySelector('#cat-`,`'),'open')">`,`</a>`]

  for (const [game, gConfig] of Object.entries(perfConfig.gameList)){
    switch(gConfig.cType){
      case "normal":
        var gameDisplay = perf_carousel.querySelector(`#perf-${game}`)        
        if(!gameDisplay){continue}
        //var icon_1080p = gameDisplay.querySelector(".perf-1080p span");
        //var icon_1440p = gameDisplay.querySelector(".perf-1440p span");
        //var icon_4k = gameDisplay.querySelector(".perf-4k span");
        var perf_body = gameDisplay.querySelector(".perf-body");
        perf_body.innerHTML = "err";
        //icon_1080p.innerHTML = icon_1440p.innerHTML = icon_4k.innerHTML = `<i class="bi bi-exclamation-circle-fill"style="color: #eabe4b;font-size: 1.2rem;vertical-align: middle;"></i>`;
        var missRes = [];
        for (let cat of Object.keys(gConfig.parts)){
          var findpart = document.querySelector(`#cat-${cat} input.part-rd-bt:checked`);          
          if(!findpart){
            missRes.push([cat, perfConfig.dictionary[cat][0]]);
          }else if(findpart.value=="emptyval"){
            missRes.push([cat, perfConfig.dictionary[cat][0]]);            
          }
        }        
        if(missRes.length){
          let txtRes = "";
          if(missRes.length == 1){
            txtRes = msg[0]+missRes[0][0]+msg[1]+missRes[0][1]+msg[2];
          }else{     
            for(let i=0; i < missRes.length;i++){
              if(i == missRes.length-1){
                txtRes += msg[0]+missRes[i][0]+msg[1]+missRes[i][1]+msg[2];
              }else if(i == missRes.length-2){
                txtRes += msg[0]+missRes[i][0]+msg[1]+missRes[i][1]+msg[2]+perfConfig.dictionary.required[1];
              }else{
                txtRes += msg[0]+missRes[i][0]+msg[1]+missRes[i][1]+msg[2]+perfConfig.dictionary.required[2];
              }
            }
          }
          perf_body.innerHTML = perfConfig.dictionary.required[0].replace("@@@",txtRes);
          break;
        }
        var minScore = "3";
        var textList = [];
        for (let [cat, settings] of Object.entries(gConfig.parts)){
          if(settings.hasOwnProperty("attr")){
            var findpart = document.querySelector(`#cat-${cat} input.part-rd-bt:checked`);
            if(settings.hasOwnProperty("safe")){if(findpart.dataset.perfattr.split(",")[settings.attr]==settings.safe){continue}}
          }
          if(findpart.dataset.perfattr.split(",")[settings.attr] < minScore){minScore = findpart.dataset.perfattr.split(",")[settings.attr]}
          textList.push([cat,perfConfig.dictionary[cat][0]]);
        }
        switch(minScore){
          case "0":
            //icon_1080p.innerHTML = icon_1440p.innerHTML = icon_4k.innerHTML = `<i class="bi bi-x-circle-fill"style="color: #dc3545;font-size: 1.2rem;vertical-align: middle;"></i>`;
            perf_body.innerHTML = perfConfig.dictionary.perfNotReady;
            break;
          case "1":
            //icon_1440p.innerHTML = icon_4k.innerHTML = `<i class="bi bi-x-circle-fill"style="color: #dc3545;font-size: 1.2rem;vertical-align: middle;"></i>`;
            //icon_1080p.innerHTML= `<i class="bi bi-check-circle-fill"style="color: #198754;font-size: 1.2rem;vertical-align: middle;"></i>`;
            perf_body.innerHTML = perfConfig.dictionary.perfReady.replace("@@@",perfConfig.dictionary[game]).replace("###","1080p");
            break;
          case "2":
            //icon_4k.innerHTML = `<i class="bi bi-x-circle-fill"style="color: #dc3545;font-size: 1.2rem;vertical-align: middle;"></i>`;
            //icon_1080p.innerHTML = icon_1440p.innerHTML = `<i class="bi bi-check-circle-fill"style="color: #198754;font-size: 1.2rem;vertical-align: middle;"></i>`;
            perf_body.innerHTML = perfConfig.dictionary.perfReady.replace("@@@",perfConfig.dictionary[game]).replace("###","1440p");
            break;
          case "3":
            //icon_1080p.innerHTML = icon_1440p.innerHTML = icon_4k.innerHTML = `<i class="bi bi-check-circle-fill"style="color: #198754;font-size: 1.2rem;vertical-align: middle;"></i>`;
            perf_body.innerHTML = perfConfig.dictionary.perfReady.replace("@@@",perfConfig.dictionary[game]).replace("###","4K");
        }/*
        let txtRes = "";
        if(textList.length == 1){
          txtRes = msg[0]+textList[0][0]+msg[1]+textList[0][1]+msg[2];
        }else{     
          for(let i=0; i < textList.length;i++){
            if(i == textList.length-1){
              txtRes += msg[0]+textList[i][0]+msg[1]+textList[i][1]+msg[2];
            }else if(i == textList.length-2){
              txtRes += msg[0]+textList[i][0]+msg[1]+textList[i][1]+msg[2]+perfConfig.dictionary.required[1];
            }else{
              txtRes += msg[0]+textList[i][0]+msg[1]+textList[i][1]+msg[2]+perfConfig.dictionary.required[2];
            }
          }
        }
        perf_body.innerHTML = perf_body.innerHTML + perfConfig.dictionary.recommend[0].replace("@@@",txtRes);*/
        break;
    }
  }
}

function catRedirect(wCat, action="toggle",focus="prod") {   
  var gtopen = document.querySelectorAll(".builder-parts .builder-part-category");
  for (let y = 0; y < gtopen.length; y++) {
    if(gtopen[y] === wCat){
      switch(action){
        case "open": wCat.classList.toggle("lp-show",true);break;
        case "close": wCat.classList.toggle("lp-show",false);break;
        default: wCat.classList.toggle("lp-show");//toggle
      }
    }else{
      gtopen[y].classList.remove("lp-show");
    }
  }
  if(focus=="none"){return}
  var catState = wCat.classList.contains("lp-show");
  var catPosTop = wCat.getBoundingClientRect().top;
  var catPosBot = wCat.getBoundingClientRect().bottom;
  var selprod = wCat.querySelector("input.part-rd-bt:checked + .listed-part, input.part-checkbox:checked + .listed-part");
  if(!catState || focus == "cat" || !selprod){
    window.scrollTo({
      top:catPosTop+window.pageYOffset-(window.innerWidth > 991 ? 138 : 128)
      //behavior: 'smooth'
    });
  }else{
    var selprodTop = selprod.getBoundingClientRect().top;
    var selprodBot = selprod.getBoundingClientRect().bottom;
    if((window.innerHeight/2-140)>selprodTop-catPosTop){
      window.scrollTo({
        top:catPosTop+window.pageYOffset-(window.innerWidth > 991 ? 138 : 128)
        //behavior: 'smooth'
      });
    }else if((window.innerHeight/2-140)>catPosBot-selprodBot){
      window.scrollTo({
        top:catPosBot+window.pageYOffset-window.innerHeight+50
        //behavior: 'smooth'
    });
    }else{
      window.scrollTo({
        top:selprodTop+window.pageYOffset-(window.innerHeight-(window.innerWidth > 991 ? 138 : 128))/2
        //behavior: 'smooth'
      });
    }
  }
  updateProdNav();
}

var compConfig = {
  "kouti": {
    "mitriki":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"0",
      "errM":"$$ Το προϊόν δεν είναι συμβατό με την επιλεγμένη !!mitriki@@Μητρική##."
    }
  },
  "mitriki": {
    "kouti":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"0",
      "errM":"$$ Το προϊόν δεν είναι συμβατό με το επιλεγμένο !!kouti@@Κουτί##."
    },
    "cpu":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"1",
      "attrB":"0",
      "errM":"$$ Το προϊόν δεν είναι συμβατό με τον επιλεγμένο !!cpu@@Επεξεργαστή##."
    },
    "psiktra":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"1",
      "attrB":"0",
      "errM":"$$ Το προϊόν δεν είναι συμβατό με την επιλεγμένη !!psiktra@@Ψύξη επεξεργαστή##."
    }
  },
  "cpu": {
    "mitriki":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"1",
      "errM":"$$ Το προϊόν δεν είναι συμβατό με την επιλεγμένη !!mitriki@@Μητρική##."
    },
    "psiktra":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"0",
      "errM":"$$ Το προϊόν δεν είναι συμβατό με την επιλεγμένη !!psiktra@@Ψύξη επεξεργαστή##."
    }      
  },
  "psiktra": {
    "mitriki":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"1",
      "errM":"$$ Το προϊόν δεν είναι συμβατό με την επιλεγμένη !!mitriki@@Μητρική##."
    },
    "cpu":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"0",
      "errM":"$$ Το προϊόν δεν είναι συμβατό με τον επιλεγμένο !!cpu@@Επεξεργαστή##."
    }
  }
}

function avCompatible(){
  var msg = [`<a class="category-link"onclick="catRedirect(document.querySelector('#cat-`,`'),'open')">`,`</a>`,`<i class="bi bi-exclamation-circle"></i>`]
  for (const [cat, rCats] of Object.entries(compConfig)) {
    var products = document.querySelectorAll(`#cat-${cat} input.part-rd-bt, #cat-${cat} input.part-checkbox`);
    break_point:
    for(let i=0;i<products.length;i++){
      if(products[i].value =="emptyval"){continue}
      products[i].disabled = false;
      var attributesA = products[i].dataset.compattr.split(";");
      for (const [rCat, cconfig] of Object.entries(rCats)) {
        var selSubProd = document.querySelectorAll(`#cat-${rCat} input.part-rd-bt:checked, #cat-${rCat} input.part-checkbox:checked`);
        for(let x=0;x<selSubProd.length;x++){
          if(selSubProd[x].value=="emptyval"){continue}
          var attributesB = selSubProd[x].dataset.compattr.split(";");
          switch(cconfig.cType){
            case "normal":
              var listA = attributesA[cconfig.attrA].split(",");
              var listB = attributesB[cconfig.attrB].split(",");
              if(cconfig.hasOwnProperty("safe")){
                if(listA.includes(cconfig.safe)||listB.includes(cconfig.safe)){
                  break;
                }
              }
              var compatible = false;
              for(const attrA of listA){
                if(listB.includes(attrA)){
                  compatible = true;
                  break;
                }
              }
              if(compatible){break}
                products[i].disabled = true;
                products[i].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = cconfig.errM.replace("!!",msg[0]).replace("@@",msg[1]).replace("##",msg[2]).replace("$$",msg[3]);
                continue break_point;
          }
        }
      }
    }
  }  
}

function avCompNarrow(alcat){
  var msg = [`<a class="category-link"onclick="catRedirect(document.querySelector('#cat-`,`'),'open')">`,`</a>`,`<i class="bi bi-exclamation-circle"></i>`]

}

function multiUpdate(){
  var cats = document.querySelectorAll(".builder-parts .builder-part-category");
  cats = [...cats].filter(cat => cat.querySelector("input.part-checkbox"))
  for(let i=0;i<cats.length;i++){
    var getSelected = cats[i].querySelectorAll("input.part-checkbox:checked");
    var emptyval = [...cats[i].querySelectorAll("input.part-checkbox")].filter(partDom => partDom.value == "emptyval")[0]
    if(!getSelected.length){
      emptyval.checked = true;
    }else if (getSelected.length>1){
      emptyval.checked = false;
    }
  }
}
function checkMulti(wElement){
  if(!wElement.classList.contains("part-checkbox")){return}
  var parentCat = wElement.parentElement.parentElement;
  var getSelected = parentCat.querySelectorAll("input.part-checkbox:checked");
  var emptyval = [...parentCat.querySelectorAll("input.part-checkbox")].filter(partDom => partDom.value == "emptyval")[0]
  if(!getSelected.length){
    emptyval.checked = true;
  }else if(wElement.value == "emptyval"){
    emptyval.checked = true;
    [...getSelected].map(partDom => partDom.value != "emptyval"?partDom.checked = false:null)
  }else{
    emptyval.checked = false;
  }
}
function updateContSel(cat){
  if(cat.querySelector(".part-rd-bt:checked, .part-checkbox:checked").value=="emptyval"){
    cat.querySelector(".part-category-head").classList.remove("contains-selected");
  }else{
    cat.querySelector(".part-category-head").classList.add("contains-selected");
  }
  updateProdNavSel();
}

function initParts(){
  var getParts = document.querySelectorAll(".builder-parts .listed-part")
  for(let i=0;i< getParts.length;i++){
    updateNumberInput(getParts[i]);
    updatePartPrice(getParts[i]);
  }
  multiUpdate()
  avCompatible();
  updateFinalPrice();
  initProdNav();
  updatePerfCarousel();
  getParts = document.querySelectorAll(".builder-part-category")
  for(let i=0;i< getParts.length;i++){
    updateContSel(getParts[i]);
  }
}

function createListeners(){
  var acc = document.querySelectorAll(".builder-part-category > .part-category-head");
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      catRedirect(this.parentElement);
    });
  }

  acc = document.querySelectorAll(".builder-part-category label.btn-change");
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      catRedirect(this.parentElement.parentElement.parentElement.parentElement.parentElement);
    });
  }

  acc = document.querySelectorAll(".builder-part-category input.part-rd-bt");
  for(let i = 0; i < acc.length; i++){
    acc[i].addEventListener("change", function() {
      var getCatParts = this.parentElement.querySelectorAll(".listed-part");
      for(let i=0;i< getCatParts.length;i++){
        updateNumberInput(getCatParts[i]);
        updatePartPrice(getCatParts[i]);
      }
      avCompatible();
      updateFinalPrice();
      updateContSel(this.parentElement.parentElement);
    })
  }
  acc = document.querySelectorAll(".builder-part-category input.part-checkbox");
  for(let i = 0; i < acc.length; i++){
    acc[i].addEventListener("change", function() {
      var getCatParts = this.parentElement.querySelectorAll(".listed-part");
      for(let i=0;i< getCatParts.length;i++){
        updateNumberInput(getCatParts[i]);
        updatePartPrice(getCatParts[i]);
      }
      checkMulti(this);
      avCompatible();
      updateFinalPrice();
      updateContSel(this.parentElement.parentElement);
    })
  }

  acc = document.querySelectorAll(".builder-part-category .part-number-input > input.part-quantity ~ .part-num-decr");
  for(let i = 0; i < acc.length; i++){
    acc[i].addEventListener("click", function() {
      var loctemp = this.parentElement.parentElement.parentElement.parentElement;
      updateNumberInput(loctemp,"decrement");
      updateFinalPrice();
    })
  }

  acc = document.querySelectorAll(".builder-part-category .part-number-input > input.part-quantity ~ .part-num-incr");
  for(let i = 0; i < acc.length; i++){
    acc[i].addEventListener("click", function() {
      var loctemp = this.parentElement.parentElement.parentElement.parentElement;
      updateNumberInput(loctemp,"increment");
      updateFinalPrice();
    })
  }

  acc = document.querySelectorAll('[data-bs-toggle="modal"][data-bs-target="#build-modal"]');
  for(let i = 0; i < acc.length; i++){
    acc[i].addEventListener("click", updateModal)
  }

  var copy_btn = document.querySelector("#build-modal .footer-interface .btn-copy-link")
  if (copy_btn) {
    copy_btn.addEventListener("click", async function() {
      var urLement = document.querySelector("#build-modal .footer-link-body");
      if(urLement.hasAttribute("data-geturl")){
        try{
          if(urLement.innerHTML == "Δημιουργία σύνδεσμου"){

            const request = await fetch(
              'https://api-ssl.bitly.com/v4/shorten',{
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${gettoken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ "long_url": urLement.dataset.geturl})
            })

            if(request.status >= 400) throw new Error(`Response status: ${request.status}`);
            const getjson = await request.json()
            urLement.innerHTML = getjson["link"];
          }
          navigator.clipboard.writeText(document.querySelector("#build-modal .footer-link-body").innerHTML);
        }catch(err){
          urLement.innerHTML = "urLement.dataset.geturl";          
          console.log(err)
          try{
            navigator.clipboard.writeText(document.querySelector("#build-modal .footer-link-body").innerHTML);
          }catch{}
        }
      }else{
        urLement.innerHTML = "Something went wrong...";        
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", function(){
  /*
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('.c-overlay-inner [data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
  */
  createListeners();
  initParts();}
)