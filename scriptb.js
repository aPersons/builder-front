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

var domCashe = {
  "dom": {},
  "domOrder": [],
  "buildModal": {},
  "prodNav": {},
  "finalPrice": {},
  "perfCarousel":{}
};

function crCats(){
  domCashe.dom = {};
  domCashe.domOrder = [];
  var tmpList = document.querySelectorAll(".builder-part-category");
  for(let i=0;i<tmpList.length;i++){
    var tmphead = tmpList[i].querySelector(".part-category-head");
    domCashe.domOrder.push(tmpList[i].id);
    domCashe.dom[domCashe.domOrder[domCashe.domOrder.length-1]] = {
      "selfDom": tmpList[i],
      "headDom": tmphead,
      "pListDom": tmpList[i].querySelector(".part-list-container"),
      "nmTxt": tmphead.textContent,
      "lpState": tmpList[i].classList.contains("lp-show")
    }
  }
}

function updateRdState(evArgs){
  var cnm = evArgs.cnm;
  var pnm = evArgs.pnm;
  var lastl = domCashe.dom[cnm].prodSelected;
  domCashe.dom[cnm].prodList[lastl].isSelected = false;
  domCashe.dom[cnm].prodList[pnm].isSelected = true;
  domCashe.dom[cnm].prodSelected = pnm;
}

var CFGRdBtHandler = [];
function RdBtHandler(){
  var evArgs = {
    pnm: this.id,
    cnm: this.parentElement.parentElement.parentElement.id
  }
  for(const fnc of CFGRdBtHandler)fnc(evArgs);
}
function crRdBt(){
  for(const cnm of domCashe.domOrder){
    var ob = domCashe.dom[cnm]
    var tmpList = ob.selfDom.querySelectorAll("input.part-rd-bt");
    if(tmpList.length){
      ob.prodType = "radio";
      ob.emptyEl = "$blank";
      ob.prodList = {};
      ob.prodOrder = [];
      for(let i=0;i<tmpList.length;i++){
        tmpList[i].removeEventListener("change",RdBtHandler);
        tmpList[i].addEventListener("change",RdBtHandler);
        var dname = tmpList[i].id;
        ob.prodOrder.push(dname);
        var cdom = tmpList[i].nextElementSibling;
        var erpL = tmpList[i].dataset.erp;
        ob.prodList[dname] = {
          "selfDom": tmpList[i],
          "cDom": cdom,
          "nmTxt": cdom.querySelector(".part-text-head").textContent,
          "priceVal": Number(cdom.querySelector(".part-price").dataset.priceval),
          "parentCat": cnm,
          "isSelected": tmpList[i].checked,
          "value": tmpList[i].value,
          "erp": erpL?erpL:"-"
        }
        if (ob.prodList[dname].value == "emptyval") ob.emptyEl = dname;
        if (ob.prodList[dname].isSelected)ob.prodSelected = dname;
      }
    }
  }
  CFGRdBtHandler.length = 0;
  CFGRdBtHandler.push(updateRdState);
}

function addProdSel(pnm, cnm){
  var qsize = domCashe.dom[cnm].prodSelected.length;
  var sOrd = domCashe.dom[cnm].prodOrder.indexOf(pnm);
  for(let i = 0;i < qsize; i++){
    var lnm = domCashe.dom[cnm].prodSelected[i];
    if (sOrd<domCashe.dom[cnm].prodOrder.indexOf(lnm)){
      domCashe.dom[cnm].prodSelected.splice(i,0,pnm);
      return
    }
  }
  domCashe.dom[cnm].prodSelected.push(pnm);
}
function removeProdSel(pnm, cnm){
  domCashe.dom[cnm].prodSelected.splice(domCashe.dom[cnm].prodSelected.indexOf(pnm),1);
}

function updateCbState(evArgs){
  var pnm = evArgs.pnm;
  var cnm = evArgs.cnm;
  
  if(domCashe.dom[cnm].prodSelected.includes(pnm)&&domCashe.dom[cnm].emptyEl==pnm){
    if(domCashe.dom[cnm].prodSelected.length>1){
      removeProdSel(pnm, cnm),
      domCashe.dom[cnm].prodList[pnm].isSelected = false;
    }else{
      domCashe.dom[cnm].prodList[pnm].selfDom.checked = true;
    }
  }else if(domCashe.dom[cnm].prodSelected.includes(pnm)){
    if(domCashe.dom[cnm].prodSelected.length<2&&domCashe.dom[cnm].emptyEl == "$blank"){
      domCashe.dom[cnm].prodList[pnm].selfDom.checked = true;
    }else{
      removeProdSel(pnm, cnm);
      domCashe.dom[cnm].prodList[pnm].isSelected = false;
      if(domCashe.dom[cnm].emptyEl != "$blank"){
        var enm = domCashe.dom[cnm].emptyEl;
        if(domCashe.dom[cnm].prodSelected.length<1){
          domCashe.dom[cnm].prodSelected = [enm]
          domCashe.dom[cnm].prodList[enm].isSelected = true;
          domCashe.dom[cnm].prodList[enm].selfDom.checked = true;
        }else if(domCashe.dom[cnm].prodSelected.length>1&&domCashe.dom[cnm].prodSelected.includes(enm)){
          removeProdSel(enm, cnm);
          domCashe.dom[cnm].prodList[enm].isSelected = false;
          domCashe.dom[cnm].prodList[enm].selfDom.checked = false;
        }
      }
    }
  }else if(domCashe.dom[cnm].emptyEl==pnm){
    for(const pr of domCashe.dom[cnm].prodSelected){
      domCashe.dom[cnm].prodList[pr].isSelected = false;
      domCashe.dom[cnm].prodList[pr].selfDom.checked = false;
    }
    domCashe.dom[cnm].prodSelected = [pnm]
    domCashe.dom[cnm].prodList[pnm].isSelected = true;
  }else {
    addProdSel(pnm, cnm);
    domCashe.dom[cnm].prodList[pnm].isSelected = true;
    if(domCashe.dom[cnm].emptyEl != "$blank"){
      if(domCashe.dom[cnm].prodSelected.includes(domCashe.dom[cnm].emptyEl)){
        var enm = domCashe.dom[cnm].emptyEl;
        removeProdSel(enm, cnm);
        domCashe.dom[cnm].prodList[enm].isSelected = false;
        domCashe.dom[cnm].prodList[enm].selfDom.checked = false;
      }
    }
  }
}

function CbCheck(){
  for(const [nm, ob] of Object.entries(domCashe.dom)){
    if(ob.prodType == "checkbox"){
      if (ob.emptyEl != "$blank"){
        if(ob.prodList.length<1){
          ob.prodSelected = [ob.emptyEl]
          ob.prodList[ob.emptyEl].isSelected = true;
          ob.prodList[ob.emptyEl].selfDom.checked = true;
        }else if (ob.prodList.length>1&&ob.prodSelected.includes(ob.emptyEl)){
          ob.prodSelected.splice(ob.prodSelected.indexOf(ob.emptyEl),1);
          ob.prodList[ob.emptyEl].isSelected = false;
          ob.prodList[ob.emptyEl].selfDom.checked = false;
        }
      }
    }
  }
}

var CFGCbBtHandler = [];
function CbBtHandler(){
  var evArgs = {
    pnm: this.id,
    cnm: this.parentElement.parentElement.parentElement.id
  }
  for (const fnc of CFGCbBtHandler)fnc(evArgs);
}
function crCbBt(){
  for(const cnm of domCashe.domOrder){
    var ob = domCashe.dom[cnm];
    var tmpList = ob.selfDom.querySelectorAll("input.part-checkbox");
    if(tmpList.length){
      ob.emptyEl = "$blank";
      ob.prodType = "checkbox";
      ob.prodSelected = [],
      ob.prodOrder = [];
      ob.prodList = {};
      for(let i=0;i<tmpList.length;i++){
        tmpList[i].removeEventListener("change",CbBtHandler);
        tmpList[i].addEventListener("change",CbBtHandler);
        var dname = tmpList[i].id;
        ob.prodOrder.push(dname);
        var cdom = tmpList[i].nextElementSibling;
        var erpL = tmpList[i].dataset.erp;
        ob.prodList[dname] = {
          "selfDom": tmpList[i],
          "cDom": cdom,
          "nmTxt": cdom.querySelector(".part-text-head").textContent,
          "priceVal": Number(cdom.querySelector(".part-price").dataset.priceval),
          "parentCat": cnm,
          "isSelected": tmpList[i].checked,
          "value": tmpList[i].value,
          "erp": erpL?erpL:"-"
        }
        if (ob.prodList[dname].value == "emptyval") ob.emptyEl = dname;
        if(ob.prodList[dname].isSelected)ob.prodSelected.push(dname);
      }
    }
  }
  CbCheck();
  CFGCbBtHandler.length = 0;
  CFGCbBtHandler.push(updateCbState);
}

function catRedirect(evArgs) {
  var wCat = evArgs.cnm;
  var action = evArgs.hasOwnProperty("action")?evArgs.action : "toggle";
  var focus = evArgs.hasOwnProperty("focus")?evArgs.focus : "prod";

  for (const k of domCashe.domOrder) {
    var ob = domCashe.dom[k];
    if(k === wCat){
      switch(action){
        case "open":
          ob.lpState = true;
          ob.selfDom.classList.add("lp-show");
        break;
        case "close":
          ob.lpState = false;
          ob.selfDom.classList.remove("lp-show");
        break;
        case "same": break;
        default://toggle
          ob.lpState = !ob.lpState
          ob.selfDom.classList.toggle("lp-show");
      }
    }else if (ob.lpState) {
      ob.lpState = false;
      ob.selfDom.classList.remove("lp-show");
    }
  }
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    if(focus=="none"){return}
    var catState = domCashe.dom[wCat].lpState;
    var catPosTop = domCashe.dom[wCat].selfDom.getBoundingClientRect().top;
    var catPosBot = domCashe.dom[wCat].selfDom.getBoundingClientRect().bottom;
    var selprod = domCashe.dom[wCat].prodList[domCashe.dom[wCat].prodType == "radio" ? domCashe.dom[wCat].prodSelected : domCashe.dom[wCat].prodSelected[0]].cDom;
    var prodNavoff = window.innerWidth<768? -30:0;
    if(!catState || focus == "cat" || !selprod || window.innerWidth>=768){
      if(catState && window.innerWidth>=768 && focus == "prod"){
        var parentPos = domCashe.dom[wCat].pListDom.getBoundingClientRect();
        var selprodTop = selprod.getBoundingClientRect().top;
        var selprodHeight = selprod.getBoundingClientRect().height;
        var prodDifference = (parentPos.height-selprodHeight)/2;
        var posOffset = domCashe.dom[wCat].pListDom.scrollTop+(selprodTop-parentPos.top)-prodDifference;
        // console.log(posOffset);
        domCashe.dom[wCat].pListDom.scrollTo({
          top: posOffset,
          behavior: 'smooth'
        })
      }
      window.scrollTo({
        top:prodNavoff+catPosTop+window.scrollY-(window.innerWidth > 991 ? 140 : 130),
        behavior: 'smooth'
      });
    }else{
      var selprodTop = selprod.getBoundingClientRect().top;
      var selprodBot = selprod.getBoundingClientRect().bottom;
      if((window.innerHeight/2-140)>selprodTop-catPosTop){
        window.scrollTo({
          top:prodNavoff+catPosTop+window.scrollY-(window.innerWidth > 991 ? 140 : 130),
          behavior: 'smooth'
        });
      }else if((window.innerHeight/2-140)>catPosBot-selprodBot){
        window.scrollTo({
          top:catPosBot+window.scrollY-window.innerHeight+50,
          behavior: 'smooth'
      });
      }else{
        window.scrollTo({
          top:selprodTop+window.scrollY-(window.innerHeight-(window.innerWidth > 991 ? 140 : 130))/2,
          behavior: 'smooth'
        });
      }
    }
  })});  
}

CFGcHeadHandler = [];
function cHeadHandler(){
  var evArgs = {
    cnm: this.parentElement.id
  }
  for(const fnc of CFGcHeadHandler)fnc(evArgs);
}
function crCOpen(){
  for(const cnm of domCashe.domOrder){
    var ob = domCashe.dom[cnm];
    ob.headDom.removeEventListener("click",cHeadHandler);
    ob.headDom.addEventListener("click",cHeadHandler);
  }
  CFGcHeadHandler.length = 0;
  CFGcHeadHandler.push(catRedirect);
}

CFGpChangeHandler = [];
function pChangeHandler(){
  var evArgs = {
    cnm: this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id,
    action: "open"
  }
  for(const fnc of CFGpChangeHandler)fnc(evArgs);
}
function crCOpenMinor(){
  for(const cnm of domCashe.domOrder){
    if(domCashe.dom[cnm].hasOwnProperty("prodList")){
      for(const pnm of domCashe.dom[cnm].prodOrder){
        var tmpch = domCashe.dom[cnm].prodList[pnm].cDom.querySelector(".btn-change");
        tmpch.removeEventListener("click",pChangeHandler);
        tmpch.addEventListener("click",pChangeHandler);
      }
    }
  }
  CFGpChangeHandler.length = 0;
  CFGpChangeHandler.push(catRedirect);
}

function updateHeadSel(evArgs){
  var ob = domCashe.dom[evArgs.cnm];
  if(ob.prodType=="radio"){
    if(ob.prodSelected == ob.emptyEl){
      if(ob.hasSelected){
        ob.hasSelected = false;
        ob.headDom.classList.remove("contains-selected");
      }
    }else if (!ob.hasSelected){
      ob.hasSelected = true;
      ob.headDom.classList.add("contains-selected");
    }
  }else if(ob.prodType=="checkbox"){
    if(ob.prodSelected.length<1||(ob.prodSelected.length<2&&ob.prodSelected.includes(ob.emptyEl))){
      if(ob.hasSelected){
        ob.hasSelected = false;
        ob.headDom.classList.remove("contains-selected");
      }
    }else if (!ob.hasSelected){
      ob.hasSelected = true;
      ob.headDom.classList.add("contains-selected");
    }
  }
}

function crHeadSel(){
  for(const cnm of domCashe.domOrder){
    domCashe.dom[cnm].hasSelected = domCashe.dom[cnm].headDom.classList.contains("contains-selected");
    updateHeadSel({"cnm":cnm});
  }
  CFGRdBtHandler.push(updateHeadSel);
  CFGCbBtHandler.push(updateHeadSel);
}

function updateProdPrice(evArgs){
  var ob = domCashe.dom[evArgs.cnm];
  if (ob.prodType == "radio") {
    var sprice = ob.prodList[ob.prodSelected].priceVal;
    for (const pnm of ob.prodOrder) {
      var pob = ob.prodList[pnm];
      var dfr = pob.priceVal - sprice;
      if(dfr == 0){
        pob.priceBlock.textContent = `+0,00€`;
        if(pob.priceColorHigher){
          pob.priceColorHigher = false;
          pob.priceBlock.classList.remove("price-higher");
        }
        if(!pob.priceColorLower){
          pob.priceColorLower = true;
          pob.priceBlock.classList.add("price-lower");
        }
      }else if(dfr < 0){
        pob.priceBlock.textContent = `${wtDecimal(dfr)}€`;
        if (pob.priceColor != "price-lower"){
          if(pob.priceColorHigher){
            pob.priceColorHigher = false;
            pob.priceBlock.classList.remove("price-higher");
          }
          if(!pob.priceColorLower){
            pob.priceColorLower = true;
            pob.priceBlock.classList.add("price-lower");
          }
        }
      }else{
        pob.priceBlock.textContent = `+${wtDecimal(dfr)}€`;
        if (pob.priceColor != "price-higher"){
          if(!pob.priceColorHigher){
            pob.priceColorHigher = true;
            pob.priceBlock.classList.add("price-higher");
          }
          if(pob.priceColorLower){
            pob.priceColorLower = false;
            pob.priceBlock.classList.remove("price-lower");
          }
        }
      }
    }
  }
}

function crProdPrice(){
  for (const cnm of domCashe.domOrder) {
    var ob = domCashe.dom[cnm];
    if (ob.prodType == "radio") {
      for (const pnm of ob.prodOrder) {
        var pod = ob.prodList[pnm];
        pod.priceBlock = pod.cDom.querySelector(".price-block");
        pod.priceColorHigher = pod.priceBlock.classList.contains("price-higher");
        pod.priceColorLower = pod.priceBlock.classList.contains("price-lower");
      }
      updateProdPrice({"cnm":cnm});
    }else if (ob.prodType == "checkbox") {
      for (const pnm of ob.prodOrder) {
        var pod = ob.prodList[pnm];
        pod.cDom.querySelector(".price-block").textContent = `${wtDecimal(pod.priceVal)}€`;
      }
    }
  }
  CFGRdBtHandler.push(updateProdPrice);
}

function updateNumberInput(evArgs){
  var cnm = evArgs.cnm;
  var pnm = evArgs.pnm;
  var opcode = evArgs.hasOwnProperty("opcode")?evArgs.opcode:"update";
  var pob = domCashe.dom[cnm].prodList[pnm];
  if(pob.isSelected){
    if(pob.qDisabled){
      pob.qDisabled = false;
      pob.qInput.disabled = false;
    }
    if(pob.qType == "dynamic"){
      if(pob.qValue<pob.qMin || pob.qValue>pob.qMax){
        pob.qValue = pob.qMin;
        pob.qInput.value = pob.qMin;
        pob.qDisplay.textContent = pob.qMin;
      }else if (opcode == "add" && pob.qValue<pob.qMax){
        pob.qValue ++;
        pob.qInput.value = pob.qValue;
        pob.qDisplay.textContent = pob.qValue;
      }else if (opcode == "sub" && pob.qValue>pob.qMin){
        pob.qValue --;
        pob.qInput.value = pob.qValue;
        pob.qDisplay.textContent = pob.qValue;
      }
      if(pob.qValue < pob.qMax){
        if(!pob.qAddAv){
          pob.qAddAv = true;
          pob.qCont.classList.add("incr-av");
        }
      }else{
        if(pob.qAddAv){
          pob.qAddAv = false;
          pob.qCont.classList.remove("incr-av");
        }
      }
      if(pob.qValue > pob.qMin){
        if(!pob.qSubAv){
          pob.qSubAv = true;
          pob.qCont.classList.add("decr-av");
        }
      }else{
        if(pob.qSubAv){
          pob.qSubAv = false;
          pob.qCont.classList.remove("decr-av");
        }
      }        
    }
  }else{
    if(!pob.qDisabled){
      pob.qDisabled = true;
      pob.qInput.disabled = true;
    }
    if(pob.qType == "dynamic"){
      if(pob.qValue != 0){
        pob.qValue = 0;
        pob.qInput.value = 0;
        pob.qDisplay.textContent = 0;
      }
      if(pob.qAddAv){
        pob.qAddAv = false;
        pob.qCont.classList.remove("incr-av");
      }
      if(pob.qSubAv){
        pob.qSubAv = false;
        pob.qCont.classList.remove("decr-av");
      }
    }
  }
}

function updateCatQuant(evArgs){
  var ob = domCashe.dom[evArgs.cnm];
  for (const pnm of ob.prodOrder) {
    updateNumberInput({
      "cnm": evArgs.cnm,
      "pnm": pnm
    });
  }
}

var CFGquantHandler=[];
function quantIncrHandler(){
  var pob = this.parentElement.parentElement.parentElement.parentElement.previousElementSibling;
  var evArgs = {
    pnm: pob.id,
    cnm: pob.parentElement.parentElement.parentElement.id,
    opcode: "add"
  }
  for(const fnc of CFGquantHandler)fnc(evArgs);
}
function quantDecrHandler(){
  var pob = this.parentElement.parentElement.parentElement.parentElement.previousElementSibling;
  var evArgs = {
    pnm: pob.id,
    cnm: pob.parentElement.parentElement.parentElement.id,
    opcode: "sub"
  }
  for(const fnc of CFGquantHandler)fnc(evArgs);
}
function crQuantity(){
  for (const cnm of domCashe.domOrder) {
    var ob = domCashe.dom[cnm];
    for (const pnm of ob.prodOrder) {
      var pob = ob.prodList[pnm];
      pob.qCont = pob.cDom.querySelector(".part-number-input");
      pob.qInput = pob.qCont.querySelector(".part-quantity");
      pob.qDisabled = pob.qInput.disabled;
      pob.qValue = Number(pob.qInput.value);
      if (pob.qCont.classList.contains("static-number")) {
        pob.qType = "static";
      }else{
        pob.qType = "dynamic";
        pob.qAddAv = pob.qCont.classList.contains("incr-av");
        pob.qSubAv = pob.qCont.classList.contains("decr-av");
        pob.qDisplay = pob.qCont.querySelector(".quantity-display");
        pob.qMin = Number(pob.qInput.min);
        pob.qMax = Number(pob.qInput.max);

        var btAdd = pob.qCont.querySelector(".part-num-incr");
        btAdd.removeEventListener("click",quantIncrHandler);
        btAdd.addEventListener("click",quantIncrHandler);
        var btSub = pob.qCont.querySelector(".part-num-decr");
        btSub.removeEventListener("click",quantDecrHandler);
        btSub.addEventListener("click",quantDecrHandler);
      }
    }
    updateCatQuant({"cnm":cnm});
  }
  CFGRdBtHandler.push(updateCatQuant);
  CFGCbBtHandler.push(updateCatQuant);

  CFGquantHandler.length = 0;
  CFGquantHandler.push(updateNumberInput);
}

function updateFinalPrice(evArgs){
  var nresult = 0;
  for(const ob of Object.values(domCashe.dom)){
    if(ob.prodType=="radio"){
      var pob = ob.prodList[ob.prodSelected];
      nresult+= pob.priceVal * pob.qValue;
    }else if(ob.prodType=="checkbox"){
      for(const pnm of ob.prodSelected){
        var pob = ob.prodList[pnm];
        nresult+= pob.priceVal * pob.qValue;
      }
    }
  }
  if(nresult!=domCashe.finalPrice.totalVal){
    domCashe.finalPrice.totalVal = nresult;
    if(domCashe.finalPrice.priceDom.length){
      var pricestr = wtDecimal(nresult);
      for(const priceItem of domCashe.finalPrice.priceDom){
        priceItem.textContent = pricestr;
      }
    }
    if(domCashe.finalPrice.priceTaxLessDom.length){
      var pricestr = wtDecimal(Math.floor(nresult/1.24));
      for(const priceItem of domCashe.finalPrice.priceTaxLessDom){
        priceItem.textContent = pricestr;
      }
    }
  }
}

function crFinalPrice(){
  domCashe.finalPrice = {}
  var buildPrice = document.querySelectorAll(".build-price-total");
  var buildPriceTaxLess = document.querySelectorAll(".build-price-taxless");
  domCashe.finalPrice.priceDom = new Array(...buildPrice);
  domCashe.finalPrice.priceTaxLessDom = new Array(...buildPriceTaxLess);
  if(buildPrice.length||buildPriceTaxLess.length){
    domCashe.finalPrice.totalVal = 0;
    updateFinalPrice({});
    CFGRdBtHandler.push(updateFinalPrice);
    CFGCbBtHandler.push(updateFinalPrice);
    CFGquantHandler.push(updateFinalPrice);
  }
}

function updateNavlpShow(evArgs){
  for(const [cnm, navob] of Object.entries(domCashe.prodNav.navigators)){
    if(domCashe.dom[cnm].lpState && !navob.lpState){
      navob.lpState = true;
      navob.navDom.classList.add("navlpshow");
    }else if (!domCashe.dom[cnm].lpState && navob.lpState){
      navob.lpState = false;
      navob.navDom.classList.remove("navlpshow");
    }
  }
}

function updateNavCatHasSelected(evArgs){
  if(domCashe.dom[evArgs.cnm].hasSelected && !domCashe.prodNav.navigators[evArgs.cnm].hasSelected){
    domCashe.prodNav.navigators[evArgs.cnm].hasSelected = true;
    var domMark = domCashe.prodNav.navigators[evArgs.cnm].navDom.firstElementChild;
    domMark.classList.remove("text-muted");
    domMark.classList.add("text-success");
  }else if(!domCashe.dom[evArgs.cnm].hasSelected && domCashe.prodNav.navigators[evArgs.cnm].hasSelected){
    domCashe.prodNav.navigators[evArgs.cnm].hasSelected = false;
    var domMark = domCashe.prodNav.navigators[evArgs.cnm].navDom.firstElementChild;
    domMark.classList.remove("text-success");
    domMark.classList.add("text-muted");
  }
}

function updateNavPos(){
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    if(domCashe.prodNav.parentBody.getBoundingClientRect().bottom<170 && window.innerWidth<=767){
      if(!domCashe.prodNav.fixedMode){
        domCashe.prodNav.fixedMode = true;
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          //domCashe.prodNav.parentBody.style.paddingBottom = `${15+domCashe.prodNav.navBody.getBoundingClientRect().height}px`;
          domCashe.prodNav.navBody.classList.add("fixed-mode");
        }));
      }
    }else{
      if(domCashe.prodNav.fixedMode){
        domCashe.prodNav.fixedMode = false;
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          //domCashe.prodNav.parentBody.style.paddingBottom = "";
          domCashe.prodNav.navBody.classList.remove("fixed-mode");
        }));
      }
    }    
    if(domCashe.prodNav.fixedMode){
      var focused = "";
      var rdistance = 0;
      for(let i = 0;i< domCashe.domOrder.length;i++){
        var nhead = domCashe.dom[domCashe.domOrder[i]].selfDom.getBoundingClientRect().top;
        var nfloor = domCashe.dom[domCashe.domOrder[i]].selfDom.getBoundingClientRect().bottom;
        if(nhead<window.innerHeight-50 && nfloor>245){
          if(!focused){
            focused = domCashe.domOrder[i]
            rdistance = nfloor
          }else if (nfloor<rdistance){
            focused = domCashe.domOrder[i]
            rdistance = nfloor
          }
        }
      }
      for(const [cnm, navob]of Object.entries(domCashe.prodNav.navigators)){
        if(cnm != focused){
          if(navob.isFocused){
            navob.isFocused = false;
            navob.navDom.classList.remove("isfocused")
          }
        }else if(!navob.isFocused){
          navob.isFocused = true;
          navob.navDom.classList.add("isfocused")
          requestAnimationFrame(()=>requestAnimationFrame(()=>{
            var navbody = domCashe.prodNav.navBody;
            var bpos = domCashe.prodNav.navigators[focused].navDom.getBoundingClientRect()
            var bleft = bpos.left;
            var bwidth = bpos.width;
            var posOffset = navbody.scrollLeft+bleft-((window.innerWidth-bwidth)/2);
            navbody.scrollTo({
              left: posOffset,
              behavior: "smooth"
            });
          }))
        }
      }
    }
  })})
}

var CFGprodNavHandler = [];
function prodNavHandler(){
  var evArgs = {
    cnm: this.dataset.navdest,
    action:"open"
  }
  for(const fnc of CFGprodNavHandler)fnc(evArgs);
}
var CFGscrollHandler = [];
var scrollHandlerAv = true;
// var tmRef;
function scrollHandler(){
  if(scrollHandlerAv){
    scrollHandlerAv = false;
    for(const fnc of CFGscrollHandler)fnc();
    setTimeout(()=>scrollHandlerAv=true,25);
  }
  // clearTimeout(tmRef);
  // tmRef = setTimeout(scrollHandlerEnd,50);
}
// var CFGscrollHandlerEnd = [];
// function scrollHandlerEnd(){
//   // scrollHandlerAv = false;
//   for(const fnc of CFGscrollHandlerEnd)fnc();
// }
function crProdNav(){
  domCashe.prodNav = {};
  var navBody = document.getElementById("prod-navigation");
  if(!navBody)return;
  domCashe.prodNav.fixedMode = false;
  domCashe.prodNav.navBody = navBody;
  domCashe.prodNav.parentBody = navBody.parentElement;
  domCashe.prodNav.navigators = {};
  var navstr = "";
  for(const cnm of domCashe.domOrder){
    var ob = domCashe.dom[cnm];
    domCashe.prodNav.navigators[cnm]={
      "lpState": ob.lpState,
      "hasSelected": ob.hasSelected,
      "isFocused": false
    };
    navstr += `<div class="prod-navigator ${ob.lpState?'navlpshow':""}" data-navdest="${cnm}">
    <i class="bi bi-circle-fill fs-xs pe-1 ${ob.hasSelected?"text-success":"text-muted"}"></i><span>${ob.nmTxt}</span></div>`;
  }
  navBody.innerHTML = navstr;
  var navList = navBody.querySelectorAll(".prod-navigator");
  for(let i=0;i<navList.length;i++){
    var cnm = navList[i].dataset.navdest;
    domCashe.prodNav.navigators[cnm].navDom = navList[i];
    navList[i].addEventListener("click",prodNavHandler);
  }
  CFGcHeadHandler.push(updateNavlpShow);
  CFGpChangeHandler.push(updateNavlpShow);

  CFGprodNavHandler.length = 0;
  CFGprodNavHandler.push(catRedirect);
  CFGprodNavHandler.push(updateNavlpShow);

  CFGRdBtHandler.push(updateNavCatHasSelected);
  CFGCbBtHandler.push(updateNavCatHasSelected);

  document.removeEventListener("scroll",scrollHandler);
  document.addEventListener("scroll",scrollHandler);
  CFGscrollHandler.length = 0;
  CFGscrollHandler.push(updateNavPos);
  // CFGscrollHandlerEnd.length = 0;
  // CFGscrollHandlerEnd.push(updateNavPos);
  updateNavPos();
}

function updateBuildModal(evArgs){
  var linktext = window.location.href.split('&');
  //linktext = `${linktext[0]}&${linktext[1]}&prefill=1`; //
  linktext = `https://www.msystems.gr/section/systems_new/?&system=18&prefill=1`;   //temp change
  var tabletext = `<div class="table-row">
  <div class="modal-cat-header">Κατηγορία</div>
  <div class="modal-prnum-header">Κωδικός</div>
  <div class="modal-product-header">Προϊόν</div>
  <div class="modal-quant-header">Τμχ.</div></div>`;
  for(let i=0;i<domCashe.domOrder.length;i++){
    var ob = domCashe.dom[domCashe.domOrder[i]];
    if(ob.prodType == "radio"){
      var pob = ob.prodList[ob.prodSelected];
      tabletext += `<div class="table-row">
      <div class="cat-nm">${ob.nmTxt}</div>
      <div class="erp-pn">${pob.erp}</div>
      <div class="prod-nm">${pob.nmTxt}</div>
      <div class="prod-quant">${pob.qValue}x</div></div>`;
      if(ob.hasSelected)linktext += `&o${i}=${pob.value}&q${i}=${pob.qValue}`;
    }else if(ob.prodType == "checkbox"){
      for(const pnm of ob.prodSelected){
        var pob = ob.prodList[pnm];
        tabletext += `<div class="table-row">
        <div class="cat-nm">${ob.nmTxt}</div>
        <div class="erp-pn">${pob.erp}</div>
        <div class="prod-nm">${pob.nmTxt}</div>
        <div class="prod-quant">${pob.qValue}x</div></div>`;
        if(ob.hasSelected)linktext += `&o${i}[]=${pob.value}&q${i}[]=${pob.qValue}`;
      }
    }
  }
  domCashe.buildModal.modalTable.innerHTML = tabletext;
  domCashe.buildModal.linkFull = linktext;
  domCashe.buildModal.qLink = "Unavailable";
  (async ()=>{
    try{  
      const request = await fetch(
        'https://api-ssl.bitly.com/v4/shorten',{
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${gettoken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "long_url": domCashe.buildModal.linkFull})
      })
      
      if(request.status >= 400) throw new Error(`Response status: ${request.status}`);
      const getjson = await request.json()
      domCashe.buildModal.qLink = getjson["link"];
      domCashe.buildModal.footerLinkBody.textContent = domCashe.buildModal.qLink;
    }catch(err){
      domCashe.buildModal.qLink = domCashe.buildModal.linkFull;
      domCashe.buildModal.footerLinkBody.textContent = domCashe.buildModal.linkFull;
      console.log(err);
    }
  })()
}

function buildShortLink(evArgs) {
  try{
    navigator.clipboard.writeText(domCashe.buildModal.qLink);
    domCashe.buildModal.btnCopy.innerHTML = '<i class="bi bi-check2"></i>';
    setTimeout(()=>{
      domCashe.buildModal.btnCopy.innerHTML = '<i class="bi bi-paperclip"></i>';      
    },2000)
  }catch{
    domCashe.buildModal.btnCopy.innerHTML = '<i class="bi bi-check2"></i>';
    setTimeout(()=>{
      domCashe.buildModal.btnCopy.innerHTML = '<i class="bi bi-x-lg"></i>';      
    },2000)
  }  
}

CFGbuildModalOpenHandler = [];
function buildModalOpenHandler(){
  var evArgs = {}
  for(const fnc of CFGbuildModalOpenHandler)fnc(evArgs);
}
CFGbuildShortLinkHandler = [];
function buildShortLinkHandler(){
  var evArgs = {}
  for(const fnc of CFGbuildShortLinkHandler)fnc(evArgs);
}
function crBuildModal(){
  domCashe.buildModal = {};
  var mdl = document.getElementById("build-modal");
  if(!mdl)return;
  domCashe.buildModal.modalTable = mdl.querySelector(".modal-body .modal-table");
  domCashe.buildModal.footerLinkBody = mdl.querySelector(".footer-link-body");
  domCashe.buildModal.linkFull = "";
  domCashe.buildModal.btnCopy = mdl.querySelector(".btn-copy-link");
  domCashe.buildModal.btnCopy.removeEventListener("click", buildShortLinkHandler);
  domCashe.buildModal.btnCopy.addEventListener("click", buildShortLinkHandler);

  var btns = document.querySelectorAll('[data-bs-toggle="modal"][data-bs-target="#build-modal"]');
  for(const btn of btns){
    btn.removeEventListener("click",buildModalOpenHandler);
    btn.addEventListener("click",buildModalOpenHandler);
  }
  CFGbuildModalOpenHandler.length=0;
  CFGbuildModalOpenHandler.push(updateBuildModal);

  CFGbuildShortLinkHandler.length=0;
  CFGbuildShortLinkHandler.push(buildShortLink);
}

CFGprodCompatibility = {
  "cat-kouti": {
    "supOrder": ["cat-mitriki"],
    "cat-mitriki":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"0",
      "errMA":"Το προϊόν δεν είναι συμβατό με την επιλεγμένη ",
      "errMB":"Μητρική"
    }
  },
  "cat-mitriki": {
    "supOrder": ["cat-kouti","cat-cpu","cat-psiktra"],
    "cat-kouti":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"0",
      "errMA":"Το προϊόν δεν είναι συμβατό με το επιλεγμένο ",
      "errMB":"Κουτί"
    },
    "cat-cpu":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"1",
      "attrB":"0",
      "errMA":"Το προϊόν δεν είναι συμβατό με τον επιλεγμένο ",
      "errMB":"Επεξεργαστή"
    },
    "cat-psiktra":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"1",
      "attrB":"0",
      "errMA":"Το προϊόν δεν είναι συμβατό με την επιλεγμένη ",
      "errMB":"Ψύξη επεξεργαστή"
    }
  },
  "cat-cpu": {
    "supOrder": ["cat-mitriki","cat-psiktra"],
    "cat-mitriki":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"1",
      "errMA":"Το προϊόν δεν είναι συμβατό με την επιλεγμένη ",
      "errMB":"Μητρική"
    },
    "cat-psiktra":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"0",
      "errMA":"Το προϊόν δεν είναι συμβατό με την επιλεγμένη ",
      "errMB":"Ψύξη επεξεργαστή"
    }      
  },
  "cat-psiktra": {
    "supOrder": ["cat-mitriki","cat-cpu"],
    "cat-mitriki":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"1",
      "errMA":"Το προϊόν δεν είναι συμβατό με την επιλεγμένη ",
      "errMB":"Μητρική"
    },
    "cat-cpu":{
      "cType":"normal",
      "safe":"$afe",
      "attrA":"0",
      "attrB":"0",
      "errMA":"Το προϊόν δεν είναι συμβατό με τον επιλεγμένο ",
      "errMB":"Επεξεργαστή"
    }
  }
}

function addUnsupported(pnm, cnm, cnmB){
  var qsize = domCashe.dom[cnm].prodList[pnm].Compatibility.length;
  var sOrd = CFGprodCompatibility[cnm].supOrder.indexOf(cnmB);
  for(let i = 0;i < qsize; i++){
    var lnm = domCashe.dom[cnm].prodList[pnm].Compatibility[i];
    if (sOrd<CFGprodCompatibility[cnm].supOrder.indexOf(lnm)){
      domCashe.dom[cnm].prodList[pnm].Compatibility.unSupported.splice(i,0,cnmB);
      return
    }
  }
  domCashe.dom[cnm].prodList[pnm].Compatibility.unSupported.push(cnmB);
}
function removeUnsupported(pnm, cnm, cnmB){
  domCashe.dom[cnm].prodList[pnm].Compatibility.unSupported.splice(domCashe.dom[cnm].prodList[pnm].Compatibility.unSupported.indexOf(cnmB),1);
}

function updateProdCompatibility(evArgs){
  if(domCashe.dom[evArgs.cnm].prodType=="radio"){
    for(const [cnm, inst] of Object.entries(CFGprodCompatibility)){
      if(!inst.supOrder.includes(evArgs.cnm)||!domCashe.dom.hasOwnProperty(cnm))continue;
      for(const pnm of domCashe.dom[cnm].prodOrder){
        if(compareProdCompatibility(cnm,pnm,evArgs.cnm,evArgs.pnm)){
          if(domCashe.dom[cnm].prodList[pnm].Compatibility.unSupported.includes(evArgs.cnm))removeUnsupported(pnm, cnm, evArgs.cnm);
        }else{
          if(!domCashe.dom[cnm].prodList[pnm].Compatibility.unSupported.includes(evArgs.cnm))addUnsupported(pnm, cnm, evArgs.cnm);
        }
        updateDisabledBLock(cnm, pnm);
      }
    }
  }else if(domCashe.dom[evArgs.cnm].prodType=="checkbox"){
    for(const [cnm, inst] of Object.entries(CFGprodCompatibility)){
      if(!inst.supOrder.includes(evArgs.cnm)||!domCashe.dom.hasOwnProperty(cnm))continue;
      for(const pnm of domCashe.dom[cnm].prodOrder){
        var defVal = false;
        for(const pnmB of domCashe.dom[evArgs.cnm].prodSelected){
          if(!compareProdCompatibility(cnm,pnm,evArgs.cnm,evArgs.pnm) && !defVal){
            defVal = true;
            break;
          }
        }
        if(defVal && !domCashe.dom[cnm].prodList[pnm].Compatibility.unSupported.includes(evArgs.cnm)){
          addUnsupported(pnm, cnm, evArgs.cnm);
        }else if(domCashe.dom[cnm].prodList[pnm].Compatibility.unSupported.includes(evArgs.cnm)){
          removeUnsupported(pnm, cnm, evArgs.cnm);
        }
        updateDisabledBLock(cnm, pnm);
      }
    }
  }
}

function checkProdCompatibility(cnm, pnm){
  var tmpUnsupported = [];
  for(const cnmB of CFGprodCompatibility[cnm].supOrder){
    if(!domCashe.dom.hasOwnProperty(cnmB))continue;
    if(domCashe.dom[cnmB].prodType=="radio"){
      if(!compareProdCompatibility(cnm,pnm,cnmB,domCashe.dom[cnmB].prodSelected)){
        tmpUnsupported.push(cnmB);
      }
    }else if(domCashe.dom[cnmB].prodType=="checkbox"){
      var defVal = false;
      for(const pnmB of domCashe.dom[cnmB].prodSelected){
        if(!compareProdCompatibility(cnm,pnm,cnmB,pnmB) && !defVal){
          defVal = true;
          break;
        }
      }
      if(defVal){
        tmpUnsupported.push(cnmB);
      }
    }
  }
  domCashe.dom[cnm].prodList[pnm].Compatibility.unSupported = tmpUnsupported;
  updateDisabledBLock(cnm, pnm);
}

function updateDisabledBLock(cnm, pnm){
  var pob = domCashe.dom[cnm].prodList[pnm]
  if(pob.disStatus == false || pob.disStatus == "unassigned" || pob.disStatus == "compatibility"){
    if(!pob.Compatibility.unSupported.length){
      if(pob.disStatus != false){
        pob.disStatus = false;
        pob.selfDom.disabled = false;
      }
      if(pob.Compatibility.dReason.lenth){
        pob.Compatibility.dReason = [];
      }
    }else if(pob.disStatus == "compatibility"){
      if(pob.Compatibility.dReason[0] != pob.Compatibility.unSupported[0]){
        pob.Compatibility.dReason[0] = pob.Compatibility.unSupported[0];
        pob.Compatibility.dReason[1].textContent = CFGprodCompatibility[cnm][pob.Compatibility.unSupported[0]].errMA;
        pob.Compatibility.dReason[2].textContent = CFGprodCompatibility[cnm][pob.Compatibility.unSupported[0]].errMB;
        pob.Compatibility.dReason[2].dataset.unsupported = pob.Compatibility.unSupported[0];
        var msg = [`<a class="category-link"onclick="catRedirect(document.querySelector('#cat-`,`'),'open')">`,`</a>`,`<i class="bi bi-exclamation-circle"></i>`]
      }
    }else{      
      if(!pob.disStatus){
        pob.disStatus = "compatibility";
        pob.selfDom.disabled = true;
      }else if(pob.disStatus == "unassigned"){
        pob.disStatus = "compatibility";
      }
      pob.disDom.innerHTML = `<i class="bi bi-exclamation-circle"></i>
      <span>${CFGprodCompatibility[cnm][pob.Compatibility.unSupported[0]].errMA}</span>
      <a class="category-link" data-unsupported="${pob.Compatibility.unSupported[0]}">${CFGprodCompatibility[cnm][pob.Compatibility.unSupported[0]].errMB}</a>.`;
      pob.Compatibility.dReason = [
        pob.Compatibility.unSupported[0],
        pob.disDom.querySelector("span"),
        pob.disDom.querySelector("a")
      ]
      pob.Compatibility.dReason[2].addEventListener("click",ProdCompRedirectHandler);
    }
  }
}

function compareProdCompatibility(cnmA, pnmA, cnmB, pnmB){
  switch(CFGprodCompatibility[cnmA][cnmB].cType){
    case "normal":
      var tmpattr = domCashe.dom[cnmA].prodList[pnmA].Compatibility.compattr;
      var attrA = tmpattr == "$afe"?["$afe"]:tmpattr.split(";")[Number(CFGprodCompatibility[cnmA][cnmB].attrA)].split(",");
      tmpattr = domCashe.dom[cnmB].prodList[pnmB].Compatibility.compattr;
      var attrB = tmpattr == "$afe"?["$afe"]:tmpattr.split(";")[Number(CFGprodCompatibility[cnmA][cnmB].attrB)].split(",");
      if(CFGprodCompatibility[cnmA][cnmB].safe){
        var sf = CFGprodCompatibility[cnmA][cnmB].safe;
        if(attrA.includes(sf)||attrB.includes(sf)){
          return true;
        }
        for(const sA of attrA){
          if(attrB.includes(sA)){
            return true;
          }
        }
        return false;
      }
  }
}

CFGprodCompRedirectHandler = [];
function ProdCompRedirectHandler(){
  var evArgs = {
    "cnm": this.dataset.unsupported
  }
  for(const fnc of CFGprodCompRedirectHandler)fnc(evArgs);
}
function crProdCompatibility(){
  var qUpdate = [];
  for(const [cnm, ob] of Object.entries(domCashe.dom)){
    for(const [pnm, pob] of Object.entries(ob.prodList)){
      if(!pob.hasOwnProperty("disStatus")){
        pob.disStatus = pob.selfDom.disabled?"unassigned":false;
      }
      if(!pob.hasOwnProperty("disDom")){
        pob.disDom = pob.cDom.querySelector(".disabled-part");
      }
      if(CFGprodCompatibility.hasOwnProperty(cnm)){
        pob.Compatibility = {
          "compattr": pob.selfDom.hasAttribute("data-compattr")?pob.selfDom.dataset.compattr:"$afe",
          "unSupported": [],
          "dReason": false
        }
        qUpdate.push([cnm,pnm]);
      }
    }
  }
  CFGprodCompRedirectHandler.length = 0;
  if(qUpdate.length){
    for(const kv of qUpdate){
      checkProdCompatibility(kv[0],kv[1]);
    }
    CFGprodCompRedirectHandler.push(catRedirect);
    CFGprodCompRedirectHandler.push(updateNavlpShow);
    CFGRdBtHandler.push(updateProdCompatibility);
    CFGCbBtHandler.push(updateProdCompatibility);
  }
}

CFGperfCarousel = {
  "dictionary":{
    "cat-cpu":"Επεξεργαστή",
    "cat-gpu":"Κάρτα Γραφικών",
    "required":"Το σύστημα χρειάζεται @@@.",
    "perfReady":"Το σύστημα είναι κατάλληλο για @@@ μέχρι ### ανάλυση.",
    "perfNotReady": "Το σύστημα είναι ανεπαρκές για αυτό το παιχνίδι.",
    "recommend": "<br/>Αλλάξτε @@@ για καλύτερη απόδοση."
  },
  "partList":["cat-cpu","cat-gpu","cat-asd"],
  "gameOrder":["lol_game","fortnite_game","control_game","fs2020_game","sottr_game"],
  "gameList":{
    "lol_game":{
      "stateFormat": "$$",
      "nmTxt":"League of Legends",
      "img_src":"assets/lol-game.jpg",
      "parts":{
        "cat-cpu":{
          "safe":false,
          "attr": "0"
        },
        "cat-gpu":{
          "safe":"$",
          "attr": "0"
        }          
      }
    },
    "fortnite_game":{
      "stateFormat": "$$",
      "nmTxt":"Fortnite",
      "img_src":"assets/fortnite-game.jpg",
      "parts":{
        "cat-cpu":{
          "safe":false,
          "attr": "1"
        },
        "cat-gpu":{
          "safe":"$",
          "attr": "1"
        }
      }
    },
    "control_game":{
      "cType":"normal",
      "nmTxt":"Control",
      "img_src":"assets/control-game.jpg",
      "parts":{
        "cat-cpu":{
          "safe":false,
          "attr": "2"
        },
        "cat-gpu":{
          "safe":"$",
          "attr": "2"
        }          
      }
    },
    "fs2020_game":{
      "cType":"normal",
      "nmTxt":"MS Flight Simulator 2020",
      "img_src":"assets/fs2020-game.jpg",
      "parts":{
        "cat-cpu":{
          "safe":false,
          "attr": "3"
        },
        "cat-gpu":{
          "safe":"$",
          "attr": "3"
        }          
      }
    },
    "sottr_game":{
      "nmTxt":"Shadow of the Tomb Raider",
      "img_src":"assets/sottr-game.jpg",
      "parts":{
        "cat-cpu":{
          "safe":false,
          "attr": "4"
        },
        "cat-gpu":{
          "safe":"$",
          "attr": "4"
        }          
      }
    }
  }
}

function updatePerfCarousel(evArgs){
  var cnm = evArgs.cnm;
  cgame:
  for(const [gnm,gob]of Object.entries(domCashe.perfCarousel.gameList)){
    if(!CFGperfCarousel.gameList[gnm].parts.hasOwnProperty(cnm))continue
    var pRes = 3;
    for(const [lcnm,catr]of Object.entries(CFGperfCarousel.gameList[gnm].parts)){
      if(domCashe.dom[lcnm].prodType == "radio"){
        var obval = domCashe.dom[lcnm].prodList[domCashe.dom[lcnm].prodSelected].perfAttr;
        var obval = obval=="$"?"$":Number(obval.split(",")[Number(catr.attr)]);
        if(obval == "$"||obval==NaN){
          if(CFGperfCarousel.gameList[gnm].parts[lcnm].safe != "$"||obval==NaN){
            wrPerfMsg(gnm,"required");
            continue cgame;
          }else{
            continue
          }
        }else if (obval < pRes){
          pRes = obval;
        }
      }else if(domCashe.dom[lcnm].prodType == "checkbox"){

      }
    }
    if(pRes == 0)wrPerfMsg(gnm, "perfNotReady");
    else if(pRes == 1)wrPerfMsg(gnm, "1080p");
    else if(pRes == 2)wrPerfMsg(gnm, "1440p");
    else if(pRes == 3)wrPerfMsg(gnm, "4k");
  }
}

function wrPerfMsg(gnm,msg){
  switch(msg){
    case "required":
      if(domCashe.perfCarousel.gameList[gnm].state != "required"){        
        domCashe.perfCarousel.gameList[gnm].state = "required";
        var tmpC = []
        for(const [cnm, sob] of Object.entries(CFGperfCarousel.gameList[gnm].parts)){
          if(!sob.safe)tmpC.push(cnm)
        }
        var tmpF = []
        for(const cnm of tmpC){
          tmpF.push(`<a class="category-link" data-perfredirect="${cnm}">${CFGperfCarousel.dictionary[cnm]}</a>`)
        }
        var tmpFields = "";
        if(tmpC.length == 1){
          tmpFields = tmpF[0];
        }else if(tmpC.length == 2){
          tmpFields = `${tmpF[0]} και ${tmpF[1]}`;
        }else if(tmpC.length > 2){
          for(let i=0;i<tmpC.length;i++){
            if(i==tmpC.length-1)tmpFields += `${tmpF[i]}`;
            else if(i==tmpC.length-2)tmpFields += `${tmpF[i]} και `;
            else tmpFields += `${tmpF[i]}, `;
          }
        }
        domCashe.perfCarousel.gameList[gnm].perfBody.classList.add("perf-required");
        domCashe.perfCarousel.gameList[gnm].perfBody.classList.remove("perf-perfNotReady","perf-1080p","perf-1440p","perf-4k");
        domCashe.perfCarousel.gameList[gnm].perfBody.innerHTML = CFGperfCarousel.dictionary.required.replace("@@@",tmpFields);
        var newlinks = domCashe.perfCarousel.gameList[gnm].perfBody.querySelectorAll(".category-link");
        for(lnk of newlinks){
          lnk.addEventListener("click",perfCarouselHandler);
        }
      }
    break;
    case "perfNotReady":case "1080p":case "1440p":case "4k":
      if(domCashe.perfCarousel.gameList[gnm].state == "required" || domCashe.perfCarousel.gameList[gnm].state == "$$"){
        domCashe.perfCarousel.gameList[gnm].perfBody.innerHTML = `
        <div style="text-align: center; color: #eabe4b;">${CFGperfCarousel.gameList[gnm].nmTxt}</div>
        <div class="progress"><div></div></div>
        `;
      }
      switch(msg){
        case "perfNotReady":
          if(domCashe.perfCarousel.gameList[gnm].state != "perfNotReady"){
            domCashe.perfCarousel.gameList[gnm].state = "perfNotReady";
            requestAnimationFrame(()=>requestAnimationFrame(()=>{         
              domCashe.perfCarousel.gameList[gnm].perfBody.classList.add("perf-perfNotReady");        
              domCashe.perfCarousel.gameList[gnm].perfBody.classList.remove("perf-required","perf-1080p","perf-1440p","perf-4k");
            }))
          }break;
        case "1080p":
          if(domCashe.perfCarousel.gameList[gnm].state != "1080p"){
            domCashe.perfCarousel.gameList[gnm].state = "1080p";
            requestAnimationFrame(()=>requestAnimationFrame(()=>{          
              domCashe.perfCarousel.gameList[gnm].perfBody.classList.add("perf-1080p");        
              domCashe.perfCarousel.gameList[gnm].perfBody.classList.remove("perf-required","perf-perfNotReady","perf-1440p","perf-4k");
            }))
          }
        break;
        case "1440p":
          if(domCashe.perfCarousel.gameList[gnm].state != "1440p"){
            domCashe.perfCarousel.gameList[gnm].state = "1440p";
            requestAnimationFrame(()=>requestAnimationFrame(()=>{
              domCashe.perfCarousel.gameList[gnm].perfBody.classList.add("perf-1440p");        
              domCashe.perfCarousel.gameList[gnm].perfBody.classList.remove("perf-required","perf-perfNotReady","perf-1080p","perf-4k");
            }))        
          }
        break;
        case "4k":
          if(domCashe.perfCarousel.gameList[gnm].state != "4k"){
            domCashe.perfCarousel.gameList[gnm].state = "4k";
            requestAnimationFrame(()=>requestAnimationFrame(()=>{
              domCashe.perfCarousel.gameList[gnm].perfBody.classList.add("perf-4k");        
              domCashe.perfCarousel.gameList[gnm].perfBody.classList.remove("perf-required","perf-perfNotReady","perf-1080p","perf-1440p");
            }))          
          }
        break;
    }
  }
}

var CFGperfCarouselHandler = [];
function perfCarouselHandler(){
  var evArgs = {
    "cnm": this.dataset.perfredirect,
    "action": "open"
  }
  for(const fnc of CFGperfCarouselHandler)fnc(evArgs);  
}

function crPerfCarousel(){
  var perfDom = document.getElementById("performance-carousel-2");
  if(!perfDom)return
  for(const cnm of CFGperfCarousel.partList){
    if(!domCashe.dom.hasOwnProperty(cnm))continue
    for(const [pnm,pob] of Object.entries(domCashe.dom[cnm].prodList)){
      var attrs = pob.selfDom.dataset.perfattr;
      pob.perfAttr = attrs?attrs:"$";
    }
  }
  domCashe.perfCarousel.perfDom = perfDom;
  domCashe.perfCarousel.gameList = {};
  var tmpMarkup = `<div style="text-align: center; color: #eabe4b;">Εκτιμώμενη Απόδοση</div>
  <!-- Indicators --><div class="carousel-indicators">`;
  for(let i=0;i<CFGperfCarousel.gameOrder.length;i++){
    tmpMarkup += `<button data-bs-target="#performance-carousel-2" data-bs-slide-to="${i}"${!i?' class="active"':""}></button>`;
  }
  tmpMarkup += '</div><!-- The slideshow --><div class="carousel-inner">';

  for(const gnm of CFGperfCarousel.gameOrder){
    domCashe.perfCarousel.gameList[gnm]={
      "state": CFGperfCarousel.gameList[gnm].stateFormat
    }
    tmpMarkup += `
    <div class="carousel-item${CFGperfCarousel.gameOrder[0] == gnm?" active":""}">
      <div class="carousel-item-inner">
        <img src="${CFGperfCarousel.gameList[gnm].img_src}"alt="">
        <div class="perf-display" id="perf-${gnm}">
          <div class="perf-body"></div>
        </div>
      </div>
    </div>
    `
  }
  tmpMarkup += `
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
  `
  perfDom.innerHTML = tmpMarkup;

  for(const gnm of CFGperfCarousel.gameOrder){
    domCashe.perfCarousel.gameList[gnm]={
      "state": "$$",
      "perfBody": perfDom.querySelector(`#perf-${gnm} .perf-body`)
    }
  }
  for(const cnm of CFGperfCarousel.partList){
    if(!domCashe.dom.hasOwnProperty(cnm))continue
    updatePerfCarousel({cnm:cnm})
  }
  
  CFGperfCarouselHandler.length = 0;
  CFGperfCarouselHandler.push(catRedirect);
  CFGperfCarouselHandler.push(updateNavlpShow);
  CFGRdBtHandler.push(updatePerfCarousel);
  CFGCbBtHandler.push(updatePerfCarousel);
}

document.addEventListener("DOMContentLoaded", function(){
  crCats();
  crRdBt();
  crCbBt();
  crQuantity();
  crProdCompatibility();

  crProdPrice();
  crFinalPrice();
  crCOpen();
  crCOpenMinor();
  crHeadSel();
  // crPerfCarousel();
  crProdNav();
  crBuildModal();
})