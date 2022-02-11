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
  "finalPrice": {}
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
  var focus = evArgs.hasOwnProperty("focus")?evArgs.action : "prod";

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
        top:catPosTop+window.scrollY-(window.innerWidth > 991 ? 140 : 130),
        behavior: 'smooth'
      });
    }else{
      var selprodTop = selprod.getBoundingClientRect().top;
      var selprodBot = selprod.getBoundingClientRect().bottom;
      if((window.innerHeight/2-140)>selprodTop-catPosTop){
        window.scrollTo({
          top:catPosTop+window.scrollY-(window.innerWidth > 991 ? 140 : 130),
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
        pod.cDom.querySelector(".price-block").textContent = wtDecimal(pod.priceVal);
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
    domMark.classList.remove("bi-slash-circle");
    domMark.classList.add("bi-check-circle");
  }else if(!domCashe.dom[evArgs.cnm].hasSelected && domCashe.prodNav.navigators[evArgs.cnm].hasSelected){
    domCashe.prodNav.navigators[evArgs.cnm].hasSelected = false;
    var domMark = domCashe.prodNav.navigators[evArgs.cnm].navDom.firstElementChild;
    domMark.classList.remove("bi-check-circle");
    domMark.classList.add("bi-slash-circle");
  }
}

function updateNavPos(){
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    if(domCashe.prodNav.parentBody.getBoundingClientRect().bottom<170 && window.innerWidth<=767){
      if(!domCashe.prodNav.fixedMode){
        domCashe.prodNav.fixedMode = true;
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          domCashe.prodNav.parentBody.style.paddingBottom = `${15+domCashe.prodNav.navBody.getBoundingClientRect().height}px`;
          domCashe.prodNav.navBody.classList.add("fixed-mode");
        }));
      }
    }else{
      if(domCashe.prodNav.fixedMode){
        domCashe.prodNav.fixedMode = false;
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          domCashe.prodNav.parentBody.style.paddingBottom = "";
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
  }
  for(const fnc of CFGprodNavHandler)fnc(evArgs);
}
var CFGscrollHandler = [];
// var scrollHandlerAv = true;
var tmRef;
function scrollHandler(){
  // if(scrollHandlerAv){
  //   scrollHandlerAv = false;
  //   for(const fnc of CFGscrollHandler)fnc();
  //   setTimeout(()=>scrollHandlerAv=true,100);
  // }
  clearTimeout(tmRef);
  tmRef = setTimeout(scrollHandlerEnd,50);
}
var CFGscrollHandlerEnd = [];
function scrollHandlerEnd(){
  scrollHandlerAv = false;
  for(const fnc of CFGscrollHandlerEnd)fnc();
}
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
    <i class="bi ${ob.hasSelected?"bi-check-circle":"bi-slash-circle"}"></i><span>${ob.nmTxt}</span><i class="bi bi-tools"></i></div>`;
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
  CFGscrollHandlerEnd.length = 0;
  CFGscrollHandlerEnd.push(updateNavPos);
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
  <div class="modal-quant-header">Τμχ.</div>
  <div class="modal-price-header">Τιμή</div>
  <div class="modal-total-header">Σύνολο</div></div>`;
  var totalVal = 0;
  for(let i=0;i<domCashe.domOrder.length;i++){
    var ob = domCashe.dom[domCashe.domOrder[i]];
    if(ob.prodType == "radio"){
      var pob = ob.prodList[ob.prodSelected];
      tabletext += `<div class="table-row">
      <div class="cat-nm">${ob.nmTxt}</div>
      <div class="erp-pn">${pob.erp}</div>
      <div class="prod-nm">${pob.nmTxt}</div>
      <div class="prod-quant">${pob.qValue}x</div>
      <div class="prod-price">${wtDecimal(pob.priceVal)} €</div>
      <div class="prod-price-total">${wtDecimal(pob.qValue * pob.priceVal)} €</div>
      </div>`;
      totalVal+= (pob.qValue * pob.priceVal);
      if(ob.hasSelected)linktext += `&o${i}=${pob.value}&q${i}=${pob.qValue}`;
    }else if(ob.prodType == "checkbox"){
      for(const pnm of ob.prodSelected){
        var pob = ob.prodList[pnm];
        tabletext += `<div class="table-row">
        <div class="cat-nm">${ob.nmTxt}</div>
        <div class="erp-pn">${pob.erp}</div>
        <div class="prod-nm">${pob.nmTxt}</div>
        <div class="prod-quant">${pob.qValue}x</div>
        <div class="prod-price">${wtDecimal(pob.priceVal)} €</div>
        <div class="prod-price-total">${wtDecimal(pob.qValue * pob.priceVal)} €</div>
        </div>`;
        totalVal+= (pob.qValue * pob.priceVal);
        if(ob.hasSelected)linktext += `&o${i}[]=${pob.value}&q${i}[]=${pob.qValue}`;
      }
    }
  }
  tabletext += `<div class="table-row">
  <div class="modal-total-title">Σύνολο:</div>
  <div></div><div></div><div></div><div></div>
  <div class="modal-total-num"><span>${wtDecimal(totalVal)}</span> €</div>
  </div>`
  domCashe.buildModal.modalTable.innerHTML = tabletext;
  domCashe.buildModal.linkFull = linktext;
  domCashe.buildModal.qLink = "Δημιουργία σύνδεσμου";
  domCashe.buildModal.footerLinkBody.textContent = "Δημιουργία σύνδεσμου";
}

async function buildShortLink(evArgs) {
  try{
    if(domCashe.buildModal.qLink == "Δημιουργία σύνδεσμου"){

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
    }
    navigator.clipboard.writeText(domCashe.buildModal.qLink);
  }catch(err){
    domCashe.buildModal.qLink = domCashe.buildModal.linkFull;
    domCashe.buildModal.footerLinkBody.textContent = domCashe.buildModal.linkFull;
    console.log(err)
    try{
      navigator.clipboard.writeText(domCashe.buildModal.linkFull);
    }catch{}
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
  var btnCopy = mdl.querySelector(".btn-copy-link");
  btnCopy.removeEventListener("click", buildShortLinkHandler);
  btnCopy.addEventListener("click", buildShortLinkHandler);

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

function updateProdCompatibility(){

}

CFGprodCompRedirectHandler = [];
function ProdCompRedirectHandler(){
  var evArgs = {}
  for(const fnc of CFGprodCompRedirectHandler)fnc(evArgs);
}
function crProdCompatibility(){
  for(const [cnm, ob] of Object.entries(domCashe.dom)){
    for(const [pnm, pob] of Object.entries(ob.prodList)){

    }
  }
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
  crProdNav();
  crBuildModal();
})