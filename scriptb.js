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

var domCashe = {
  "dom":{},
  "domOrder":[],
  "buildModal":{},
  "prodNav":{}
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
      "nmTxt": tmphead.textContent,
      "lpState": tmpList[i].classList.contains("lp-show")
    }
  }
}

function updateRdState(evArgs){
  var lastl = domCashe.dom[evArgs.cnm].prodSelected;
  domCashe.dom[cnm].prodList[lastl].isSelected = false;
  domCashe.dom[cnm].prodList[pnm].isSelected = true;
  domCashe.dom[cnm].prodSelected = pnm;
}

var CFGRdBtHandler = [];
function RdBtHandler(){
  var evArgs = {
    pnm: this.id,
    cnm: "cat-"+this.name
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
        ob.prodList[dname] = {
          "selfDom": tmpList[i],
          "cDom": cdom,
          "nmTxt": cdom.querySelector(".part-text-head").textContent,
          "priceVal": Number(cdom.querySelector(".part-price").dataset.priceval),
          "parentCat": cnm,
          "isSelected": tmpList[i].checked,
          "value": tmpList[i].value,
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
    cnm: "cat-"+this.name
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
        ob.prodList[dname] = {
          "selfDom": tmpList[i],
          "cDom": cdom,
          "nmTxt": cdom.querySelector(".part-text-head").textContent,
          "priceVal": Number(cdom.querySelector(".part-price").dataset.priceval),
          "parentCat": cnm,
          "isSelected": tmpList[i].checked,
          "value": tmpList[i].value,
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

function catRedirect(wCat, action="toggle",focus="prod") {
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
  if(focus=="none"){return}
  var catState = domCashe.dom[wCat].lpState;
  var catPosTop = domCashe.dom[wCat].selfDom.getBoundingClientRect().top;
  var catPosBot = domCashe.dom[wCat].selfDom.getBoundingClientRect().bottom;
  var selprod = domCashe.dom[wCat].prodList[domCashe.dom[wCat].prodType == "radio" ? domCashe.dom[wCat].prodSelected : domCashe.dom[wCat].prodSelected[0]].cDom;
  if(!catState || focus == "cat" || !selprod){
    window.scrollTo({
      top:catPosTop+window.pageYOffset-(window.innerWidth > 991 ? 138 : 128),
      behavior: 'smooth'
    });
  }else{
    var selprodTop = selprod.getBoundingClientRect().top;
    var selprodBot = selprod.getBoundingClientRect().bottom;
    if((window.innerHeight/2-140)>selprodTop-catPosTop){
      window.scrollTo({
        top:catPosTop+window.pageYOffset-(window.innerWidth > 991 ? 138 : 128),
        behavior: 'smooth'
      });
    }else if((window.innerHeight/2-140)>catPosBot-selprodBot){
      window.scrollTo({
        top:catPosBot+window.pageYOffset-window.innerHeight+50,
        behavior: 'smooth'
    });
    }else{
      window.scrollTo({
        top:selprodTop+window.pageYOffset-(window.innerHeight-(window.innerWidth > 991 ? 138 : 128))/2,
        behavior: 'smooth'
      });
    }
  }
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
    cnm: this.parentElement.parentElement.parentElement.parentElement.parentElement.id,
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
    updateHeadSel(cnm);
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
      updateProdPrice(cnm);
    }else if (ob.prodType == "checkbox") {
      for (const pnm of ob.prodOrder) {
        var pod = ob.prodList[pnm];
        pod.cDom.querySelector(".price-block").textContent = wtDecimal(pod.priceVal);
      }
    }
  }
  CFGRdBtHandler.push(updateProdPrice);
}

function updateNumberInput(partDom, action="update"){
  var inputHead = partDom.querySelector(".part-number-input");
  if(!inputHead)return;
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

function updateCatQuant(cnm){
  var ob = domCashe.dom[cnm];
  for (const pnm of ob.prodOrder) {
    var pob = ob.prodList[pnm]
    if(pob.isSelected){
      if(pob.qDisabled){
        pob.qDisabled = false;
        pob.qInput.disabled = false;
        if(pob.qType == "dynamic" && (pob.qValue<pob.qMin || pob.qValue>pob.qMax)){
          pob.qValue = qMin;
          pob.qInput.value = qMin;
          pob.qDisplay.textContent = qMin;
        }
      }
    }else{
      if(!pob.qDisabled){
        pob.qDisabled = true;
        pob.qInput.disabled = true;
        if(pob.qType == "dynamic" && pob.qValue != 0){
          pob.qValue = 0;
          pob.qInput.value = 0;
          pob.qDisplay.textContent = 0;
        }
      }
    }
  }
}

var CFGquantHandler={}
function quantIncrHandler(){
  var CFG = CFGquantHandler;
}
function quantDecrHandler(){
  var CFG = CFGquantHandler;
}
function crQuantity(){
  for (const cnm of domCashe.domOrder) {
    var ob = domCashe.dom[cnm];
    for (const pnm of ob.prodOrder) {
      var pob = ob.prodList[pnm];
      var  qcont = pob.cDom.querySelector(".part-number-input");
      pob.qInput = qcont.querySelector(".part-quantity");
      pob.qDisabled = pob.qInput.disabled;
      if (qcont.classList.contains("static-number")) {
        pob.qType = "static";
      }else{
        pob.qType = "dynamic";
        pob.qAddAv = qcont.classList.contains("incr-av");
        pob.qSubAv = qcont.classList.contains("decr-av");
        pob.qDisplay = qcont.querySelector(".quantity-display");
        pob.qValue = Number(pob.qInput.value);
        pob.qMin = Number(pob.qInput.min);
        pob.qMax = Number(pob.qInput.max);

        var btAdd = qcont.querySelector(".part-num-incr");
        btAdd.removeEventListener("click",quantIncrHandler);
        btAdd.addEventListener("click",quantIncrHandler);
        var btSub = qcont.querySelector(".part-num-decr");
        btSub.removeEventListener("click",quantDecrHandler);
        btSub.addEventListener("click",quantDecrHandler);
      }
    }
    updateCatQuant(cnm);
  }
  CFGRdBtHandler.push(updateCatQuant);
  CFGCbBtHandler.push(updateCatQuant);
}


document.addEventListener("DOMContentLoaded", function(){
  crCats();
  crRdBt();
  crCbBt();
  crQuantity();

  crProdPrice();
  crCOpen();
  crCOpenMinor();
  crHeadSel();
})