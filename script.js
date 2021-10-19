function wtDedimal(wholeNum){
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
  var selectedPart = partDom.parentElement.querySelector("input.part-rd-bt:checked + div.listed-part");

  var partPrice = partDom.querySelector(".part-price .price-main");
  var partPriceValue = partPrice.dataset.priceval;
  var partDifference = partDom.querySelector(".part-price .price-difference");

  partPrice.innerHTML = `${wtDedimal(partPriceValue)}€`; 

  if(selectedPart){
    var selectedPriceValue = selectedPart.querySelector(".part-price .price-main").dataset.priceval;
    var result = partPriceValue - selectedPriceValue;
    if(result == 0){
      partDifference.innerHTML = `(+0,00€)`;
      partDifference.classList.add("price-lower");
      partDifference.classList.remove("price-higher");
    }else if(result < 0){
      partDifference.innerHTML = `(${wtDedimal(result)}€)`;
      partDifference.classList.add("price-lower");
      partDifference.classList.remove("price-higher");
    }else{
      partDifference.innerHTML = `(+${wtDedimal(result)}€)`;
      partDifference.classList.add("price-higher");
      partDifference.classList.remove("price-lower");
    }
  }else{
    partDifference.innerHTML = "(+0,00€)";
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
  inputHead.querySelector(".quantity-display div").innerHTML = inputValue.value;
}

function updateFinalPrice(){
  //var modTable = document.querySelector("#build-modal .modal-table .modal-prod");
  var modTable = document.querySelector("#build-modal .modal-table");
  if(modTable){
    //modTable.innerHTML = "";
    modTable.innerHTML = `<div class="modal-cat-header">Κατηγορία</div>
                          <div class="modal-prnum-header">Κωδικός</div>
                          <div class="modal-product-header">Προϊόν</div>
                          <div class="modal-quant-header">Τμχ.</div>
                          <div class="modal-price-header">Τιμή</div>
                          <div class="modal-total-header">Σύνολο</div>`;
    var linktext = window.location.href.split('&');
    linktext = `${linktext[0]}&${linktext[1]}&prefill=1`;
  }  
  var sum = 0;
  var priceEl = document.querySelector(".builder-product-cart .build-price-total strong span"); 
  var getCats = document.querySelectorAll(".builder-parts .builder-part-category");
  if(getCats && (priceEl || modTable)){
    for(let i = 0; i< getCats.length; i++){
      var sel_prod = getCats[i].querySelector("input:checked");
      var prod_price = 0;
      var prod_price_total = 0;
      var prod_quant = 0;
      var erp_pn = "-";
      var prod_name = "-";
      if(sel_prod){
        prod_name = sel_prod.nextElementSibling.querySelector(".part-text-head").innerHTML;
        if(sel_prod.value != "emptyval"){
          erp_pn = sel_prod.dataset.erp;
          prod_price = sel_prod.nextElementSibling.querySelector(".price-main").dataset.priceval;
          prod_quant = sel_prod.nextElementSibling.querySelector(".part-number-input .part-quantity");
          if(prod_quant){
            prod_quant = prod_quant.value;
          }else{
            prod_quant = 1;
          }
          prod_price_total = Number(prod_price) * prod_quant;
          sum += prod_price_total;
          if(modTable){
            linktext += `&o${i}=${sel_prod.value}&q${i}=${prod_quant}`;
          }
        }
      }      
      if(modTable){        
        modTable.insertAdjacentHTML("beforeend",`<div class="cat-nm">${getCats[i].querySelector(".part-category-head").innerHTML}</div>
                                                 <div class="erp-pn">${erp_pn}</div>
                                                 <div class="prod-nm">${prod_name}</div>
                                                 <div class="prod-quant">${prod_quant}x</div>
                                                 <div class="prod-price">${wtDedimal(prod_price)} €</div>
                                                 <div class="prod-price-total">${wtDedimal(prod_price_total)} €</div>`);
      }
    }
  }
  sum = wtDedimal(sum);
  if(priceEl){    
    priceEl.innerHTML = sum;
  }
  if(modTable){
    //modTable.parentElement.querySelector(".modal-total-num span").innerHTML = sum;
    modTable.insertAdjacentHTML("beforeend",`<div class="modal-total-title">Σύνολο:</div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div class="modal-total-num"><span>${sum}</span> €</div>`)
    document.querySelector("#build-modal .modal-footer .footer-link-body").innerHTML = linktext;
  }
}
function updateProdNav(forceInit=false){
  var navBody = document.querySelector(".builder-product .prod-navigation");
  if(!navBody){return}

  var getCats = document.querySelectorAll(".builder-parts .builder-part-category");
  if(navBody.innerText=="Needs Init"||forceInit){
    var endList = "";
    for(let i = 0;i< getCats.length;i++){
      var nameText = getCats[i].querySelector(".part-category-head").innerText;
      var catTarget = getCats[i].id;   
      endList += `<div class="prod-navigator" data-navdest="${catTarget}"><i class="bi bi-tools"></i>${nameText}<span>-,--€</span></div>`;    
    }
    navBody.innerHTML = endList;
    var navList = navBody.querySelectorAll(".prod-navigator");
    for(let n=0;n<navList.length;n++){
      navList[n].addEventListener("click",function(){catRedirect(getCats[n])});
    }
  }
  var navList = document.querySelectorAll(".prod-navigation .prod-navigator");
    for(let i=0;i<navList.length;i++){
      var catTargetDom = document.querySelector(`.builder-part-category#${navList[i].dataset.navdest}`);
      if(catTargetDom.classList.contains("lp-show")){
        navList[i].style.backgroundColor = "#f6f6f6";
      }else{
      navList[i].style.backgroundColor = "";
      }
    }
  for(let i = 0;i< navList.length;i++){
    var selected = document.querySelector(`.builder-part-category#${navList[i].dataset.navdest} input:checked`);
    var priceBox = navList[i].querySelector(`span`);
    if(!selected){
      priceBox.innerHTML = "-,--€";
    }else if(selected.value == "emptyval"){
      priceBox.innerHTML = "0,00€";
    }else{
      var price = Number(selected.nextElementSibling.querySelector(".price-main").dataset.priceval);
      var quant = selected.nextElementSibling.querySelector("input.part-quantity");
      priceBox.innerHTML = `${wtDedimal(price*(quant?Number(quant.value):1))}€`;
    }
  }
}
function updatePerfCarousel(){//alt
  var perf_carousel = document.querySelector("#performance-carousel-2");
  if(!perf_carousel){return;}
  var gList = [
    "lol_game",
    "fortnite_game",
    "control_game",
    "fs2020_game",
    "sottr_game"
  ]
  var redStr = `<a class="category-link"onclick="catRedirect(document.querySelector('#cat-!!!'),'open')">@@@</a>`;
  for(gName of gList){
    perf_carousel.querySelector(`#perf-${gName} .perf-1080p span`).innerHTML = `<i class="bi bi-exclamation-circle-fill"style="color: #eabe4b;font-size: 1.2rem;vertical-align: middle;"></i>`;
    perf_carousel.querySelector(`#perf-${gName} .perf-1440p span`).innerHTML = `<i class="bi bi-exclamation-circle-fill"style="color: #eabe4b;font-size: 1.2rem;vertical-align: middle;"></i>`;
    perf_carousel.querySelector(`#perf-${gName} .perf-4k span`).innerHTML = `<i class="bi bi-exclamation-circle-fill"style="color: #eabe4b;font-size: 1.2rem;vertical-align: middle;"></i>`;
    perf_carousel.querySelector(`#perf-${gName} .perf-body`).innerHTML = "error";
  }
  var sel_mb = document.querySelector(".builder-parts .builder-part-category.mitriki input:checked");
  var sel_cpu = document.querySelector(".builder-parts .builder-part-category.cpu input:checked");
  var sel_ram = document.querySelector(".builder-parts .builder-part-category.ram input:checked");
  var sel_gpu = document.querySelector(".builder-parts .builder-part-category.gpu input:checked");
  if(!(sel_mb && sel_cpu && sel_ram && sel_gpu)){
    return;
  }
  if((sel_mb.disabled || sel_cpu.disabled || sel_ram.disabled || sel_gpu.disabled)){
    return;
  }
  var missingText = "";
  if(sel_mb.value == "emptyval"){missingText += `Χρειάζεσαι ${redStr.replace("!!!","mitriki").replace("@@@","Μητρική")}<br/>`;}
  if(sel_cpu.value == "emptyval"){missingText += `Χρειάζεσαι ${redStr.replace("!!!","cpu").replace("@@@","Επεξεργαστή")}<br/>`;}
  if(sel_ram.value == "emptyval"){missingText += `Χρειάζεσαι ${redStr.replace("!!!","ram").replace("@@@","Μνήμη RAM")}<br/>`;}
  if(sel_gpu.value == "emptyval"){missingText += `Χρειάζεσαι ${redStr.replace("!!!","gpu").replace("@@@","Κάρτα Γραφικών")}<br/>`;}
  if(missingText.length){
    for(gName of gList){
      perf_carousel.querySelector(`#perf-${gName} .perf-body`).innerHTML = missingText.substring(0,missingText.length-5);
    }
  }else{
    for(gName of gList){
      //1080p
      var perfText = "";
      if(sel_cpu.getAttribute(`data-perf_${gName}`) < 1){perfText += `Ο ${redStr.replace("!!!","cpu").replace("@@@","Επεξεργαστής")}Επεξεργαστής είναι ανεπαρκής<br/>`;}
      if(sel_gpu.getAttribute(`data-perf_${gName}`) < 1){perfText += `Η <a ${redStr.replace("!!!","gpu").replace("@@@","Κάρτα Γραφικών")} είναι ανεπαρκής</a><br/>`;}
      if(!perfText.length){
        perf_carousel.querySelector(`#perf-${gName} .perf-1080p span`).innerHTML = `<i class="bi bi-check-circle-fill"style="color: #198754;font-size: 1.2rem;vertical-align: middle;"></i>`;
        perf_carousel.querySelector(`#perf-${gName} .perf-body`).innerHTML = "Ready for 1080p";
      }else{
        perf_carousel.querySelector(`#perf-${gName} .perf-1080p span`).innerHTML = `<i class="bi bi-x-circle-fill"style="color: #dc3545;font-size: 1.2rem;vertical-align: middle;"></i>`;
        perf_carousel.querySelector(`#perf-${gName} .perf-body`).innerHTML = perfText.substring(0,perfText.length-5);
      }
      //1440p
      perfText = "";
      if(sel_cpu.getAttribute(`data-perf_${gName}`) < 2){perfText += `Ο ${redStr.replace("!!!","cpu").replace("@@@","Επεξεργαστής")}Επεξεργαστής είναι ανεπαρκής<br/>`;}
      if(sel_gpu.getAttribute(`data-perf_${gName}`) < 2){perfText += `Η <a ${redStr.replace("!!!","gpu").replace("@@@","Κάρτα Γραφικών")} είναι ανεπαρκής</a><br/>`;}
      if(!perfText.length){
        perf_carousel.querySelector(`#perf-${gName} .perf-1440p span`).innerHTML = `<i class="bi bi-check-circle-fill"style="color: #198754;font-size: 1.2rem;vertical-align: middle;"></i>`;
        perf_carousel.querySelector(`#perf-${gName} .perf-body`).innerHTML = "Ready for 1440p";
      }else{
        perf_carousel.querySelector(`#perf-${gName} .perf-1440p span`).innerHTML = `<i class="bi bi-x-circle-fill"style="color: #dc3545;font-size: 1.2rem;vertical-align: middle;"></i>`;
        perf_carousel.querySelector(`#perf-${gName} .perf-body`).innerHTML = perfText.substring(0,perfText.length-5);
      }
      //4k
      perfText = "";
      if(sel_cpu.getAttribute(`data-perf_${gName}`) < 3){perfText += `Ο ${redStr.replace("!!!","cpu").replace("@@@","Επεξεργαστής")}Επεξεργαστής είναι ανεπαρκής<br/>`;}
      if(sel_gpu.getAttribute(`data-perf_${gName}`) < 3){perfText += `Η <a ${redStr.replace("!!!","gpu").replace("@@@","Κάρτα Γραφικών")} είναι ανεπαρκής</a><br/>`;}
      if(!perfText.length){
        perf_carousel.querySelector(`#perf-${gName} .perf-4k span`).innerHTML = `<i class="bi bi-check-circle-fill"style="color: #198754;font-size: 1.2rem;vertical-align: middle;"></i>`;
        perf_carousel.querySelector(`#perf-${gName} .perf-body`).innerHTML = "Ready for 4K";
      }else{
        perf_carousel.querySelector(`#perf-${gName} .perf-4k span`).innerHTML = `<i class="bi bi-x-circle-fill"style="color: #dc3545;font-size: 1.2rem;vertical-align: middle;"></i>`;
        perf_carousel.querySelector(`#perf-${gName} .perf-body`).innerHTML = perfText.substring(0,perfText.length-5);
      }
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
  var catState = wCat.classList.contains("lp-show");
  var catPosTop = wCat.getBoundingClientRect().top;
  var catPosBot = wCat.getBoundingClientRect().bottom;
  var selprod = wCat.querySelector("input:checked + .listed-part");
  if(!catState || focus == "cat" || !selprod){
    window.scrollTo(0,catPosTop+window.pageYOffset-(window.innerWidth > 991 ? 138 : 128));
  }else{
    var selprodTop = selprod.getBoundingClientRect().top;
    var selprodBot = selprod.getBoundingClientRect().bottom;
    if((window.innerHeight/2-140)>selprodTop-catPosTop){
      window.scrollTo(0,catPosTop+window.pageYOffset-(window.innerWidth > 991 ? 138 : 128));
    }else if((window.innerHeight/2-140)>catPosBot-selprodBot){
      window.scrollTo(0,catPosBot+window.pageYOffset-window.innerHeight+50);
    }else{
      window.scrollTo(0,selprodTop+window.pageYOffset-(window.innerHeight-(window.innerWidth > 991 ? 138 : 128))/2);
    }
  }
  updateProdNav();
}
function avCompatible(){
  //"Το προϊόν δεν είναι συμβατό με την επιλεγμένη <a class="category-link" onclick="catRedirect(document.querySelector('#cat-mitriki'),'open')">Μητρική</a>."
  var compConfig = {
    "kouti": {
      "mitriki":{
        "cType":"reverse",
        "attrA":"0",
        "attrB":"0",
        "errM":"Το προϊόν δεν είναι συμβατό με την επιλεγμένη !!mitriki@@Μητρική##."
      }
    },
    "mitriki": {
      "kouti":{
        "cType":"normal",
        "attrA":"1",
        "attrB":"0",
        "errM":"Το προϊόν δεν είναι συμβατό με το επιλεγμένο !!kouti@@Κουτί##."
      },
      "cpu":{
        "cType":"normal",
        "attrA":"1",
        "attrB":"0",
        "errM":"Το προϊόν δεν είναι συμβατό με τον επιλεγμένο !!cpu@@Επεξεργαστή##."
      },
      "psiktra":{
        "cType":"normal",
        "attrA":"1",
        "attrB":"0",
        "errM":"Το προϊόν δεν είναι συμβατό με την επιλεγμένη !!psiktra@@Ψύξη επεξεργαστή##."
      }
    },
    "cpu": {
      "mitriki":{
        "cType":"normal",
        "attrA":"0",
        "attrB":"1",
        "errM":"Το προϊόν δεν είναι συμβατό με την επιλεγμένη !!mitriki@@Μητρική##."
      },
      "psiktra":{
        "cType":"normal",
        "attrA":"0",
        "attrB":"0",
        "errM":"Το προϊόν δεν είναι συμβατό με την επιλεγμένη !!psiktra@@Ψύξη επεξεργαστή##."
      }      
    },
    "psiktra": {
      "mitriki":{
        "cType":"reverse",
        "attrA":"0",
        "attrB":"1",
        "errM":"Το προϊόν δεν είναι συμβατό με την επιλεγμένη !!mitriki@@Μητρική##."
      },
      "cpu":{
        "cType":"reverse",
        "attrA":"0",
        "attrB":"0",
        "errM":"Το προϊόν δεν είναι συμβατό με την επιλεγμένη !!psiktra@@Ψύξη επεξεργαστή##."
      }
    }
  }
  var msg = [`<a class="category-link"onclick="catRedirect(document.querySelector('#cat-`,`'),'open')">`,`</a>`]
  for (const [cat, rCats] of Object.entries(compConfig)) {
    var products = document.querySelectorAll(`#cat-${Cat} .part-list-containter input.part-rd-bt`);
    break_point:
    for(let i=0;i<products.length;i++){
      if(products[i].value =="emptyval"){continue}
      products[i].disabled = false;
      var attributesA = products[i].dataset.compattr.split(";");
      for (const [rCat, cconfig] of Object.entries(rCats)) {
        var selSubProd = document.querySelector(`#cat-${rCat} .part-list-containter input.part-rd-bt:checked`);
        if(!selSubProd){continue}
        if(selSubProd.value=="emptyval"){continue}
        var attributesB = selSubProd.dataset.compattr.split(";");
        switch(cconfig.cType){
          case "normal":case "reverse":
            if(cconfig.cType=="normal"){var attributeA = attributesA[cconfig.attrA]; var attributeB = attributesB[cconfig.attrB].split(",");}
                                   else{var attributeA = attributesB[cconfig.attrB]; var attributeB = attributesA[cconfig.attrA].split(",");}
            if(!attributeB.contains(attributeA)){
              products[i].disabled = true;
              products[i].nextElementSibling,querySelector(".part-btn .disabled-part").innerHTML = cconfig.errM.replace("!!",msg[0]).replace("@@",msg[1]).replace("##",msg[2]);
              continue break_point;
            }break;
        }
      }
    }
  }  
}
function avCompatible(){  
  var redStr = `<a class="category-link"onclick="catRedirect(document.querySelector('#cat-!!!'),'open')">@@@</a>`;
  var getCats = document.querySelectorAll(`.builder-parts .builder-part-category.kouti,
                                             .builder-parts .builder-part-category.mitriki,
                                             .builder-parts .builder-part-category.cpu,
                                             .builder-parts .builder-part-category.ram,
                                             .builder-parts .builder-part-category.gpu,
                                             .builder-parts .builder-part-category.psiktra`);

  for(let i=0;i<getCats.length;i++){
    var partList = getCats[i].querySelectorAll("input.part-rd-bt");
    for(let y=0;y<partList.length;y++){
      partList[y].disabled = false;
      partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = "";
      if(partList[y].value != "emptyval" && partList[y].checked != true){
        switch (partList[y].name){
          case "kouti":
            var partCheck = document.querySelector(".builder-parts .builder-part-category.mitriki input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(! partList[y].getAttribute("data-mobo-size").split(",").includes(partCheck.getAttribute("data-mobo-size"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με την επιλεγμένη ${redStr.replace("!!!","mitriki").replace("@@@","Μητρική")}.`;
                }
              }
            }
          break;
          case "mitriki":
            var partCheck = document.querySelector(".builder-parts .builder-part-category.kouti input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(! partCheck.getAttribute("data-mobo-size").split(",").includes(partList[y].getAttribute("data-mobo-size"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με το επιλεγμένο ${redStr.replace("!!!","kouti").replace("@@@","Κουτί")}.`;
                  break;
                }
              }
            }
            partCheck = document.querySelector(".builder-parts .builder-part-category.cpu input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(! (partList[y].getAttribute("data-socket") == partCheck.getAttribute("data-socket"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με τον επιλεγμένο ${redStr.replace("!!!","cpu").replace("@@@","Επεξεργαστή")}.`;
                  break;
                }
              }
            }
            partCheck = document.querySelector(".builder-parts .builder-part-category.psiktra input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(! partCheck.getAttribute("data-socket").split(",").includes(partList[y].getAttribute("data-socket"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με την επιλεγμένη ${redStr.replace("!!!","psiktra").replace("@@@","Ψύξη επεξεργαστή")}.`;
                }
              }
            }
          break;
          case "cpu":
            var partCheck = document.querySelector(".builder-parts .builder-part-category.mitriki input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(!(partList[y].getAttribute("data-socket") == partCheck.getAttribute("data-socket"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με την επιλεγμένη ${redStr.replace("!!!","mitriki").replace("@@@","Μητρική")}.`;
                  break;
                }
              }
            }
            partCheck = document.querySelector(".builder-parts .builder-part-category.psiktra input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(! partCheck.getAttribute("data-socket").split(",").includes(partList[y].getAttribute("data-socket"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με την επιλεγμένη ${redStr.replace("!!!","psiktra").replace("@@@","Ψύξη επεξεργαστή")}.`;
                }
              }
            }
          break;
          case "psiktra":
            var partCheck = document.querySelector(".builder-parts .builder-part-category.cpu input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(! partList[y].getAttribute("data-socket").split(",").includes(partCheck.getAttribute("data-socket"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με τον επιλεγμένο ${redStr.replace("!!!","cpu").replace("@@@","Επεξεργαστή")}.`;
                  break;
                }
              }
            }
            partCheck = document.querySelector(".builder-parts .builder-part-category.mitriki input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(! partList[y].getAttribute("data-socket").split(",").includes(partCheck.getAttribute("data-socket"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με την επιλεγμένη ${redStr.replace("!!!","mitriki").replace("@@@","Μητρική")}.`;
                }
              }
            }
          break;
        }
      }
    }
  }
}

function initParts(){
  var getParts = document.querySelectorAll(".builder-parts .listed-part")
  for(let i=0;i< getParts.length;i++){
    updateNumberInput(getParts[i]);
    updatePartPrice(getParts[i]);
  }
  avCompatible();
  updateFinalPrice();
  updateProdNav();
  updatePerfCarousel();
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
      updateProdNav();
      updatePerfCarousel();
    })
  }

  acc = document.querySelectorAll(".builder-part-category .part-number-input > input.part-quantity ~ .part-num-decr");
  for(let i = 0; i < acc.length; i++){
    acc[i].addEventListener("click", function() {
      var loctemp = this.parentElement.parentElement.parentElement.parentElement;
      updateNumberInput(loctemp,"decrement");
      updateFinalPrice();
      updateProdNav();
    })
  }

  acc = document.querySelectorAll(".builder-part-category .part-number-input > input.part-quantity ~ .part-num-incr");
  for(let i = 0; i < acc.length; i++){
    acc[i].addEventListener("click", function() {
      var loctemp = this.parentElement.parentElement.parentElement.parentElement;
      updateNumberInput(loctemp,"increment");
      updateFinalPrice();
      updateProdNav();
    })
  }
  var copy_btn = document.querySelector("#build-modal .footer-interface .btn-copy-link")
  if (copy_btn) {
    copy_btn.addEventListener("click", function () {
      /*window.getSelection().selectAllChildren(
        document.querySelector("#build-modal .footer-link-body")
      );*/
      try {
        navigator.clipboard.writeText(document.querySelector("#build-modal .footer-link-body").innerHTML);
        //var successful = document.execCommand("copy");
        //var msg = successful ? "successful" : "unsuccessful";
      } catch (err) { }
    });
  }
}
document.addEventListener("DOMContentLoaded", function(){
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('.c-overlay-inner [data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
  createListeners();
  initParts();}
)