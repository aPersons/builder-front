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
  "buildModal":{},
  "prodNav":{}
};

function crCats(){
  domCashe.dom = {};
  var tmpList = document.querySelectorAll(".builder-part-category");
  for(let i=0;i<tmpList.length;i++){
    var tmphead = tmpList[i].querySelector(".part-category-head");
    domCashe.dom[tmpList[i].id] = {
      "selfDom": tmpList[i],
      "headDom": tmphead,
      "nmTxt": tmphead.innerText,
      "lpState": tmpList[i].classList.contains("lp-show")
    }
  }
}

function updateRdState(pnm, cnm){
  var lastl = domCashe.dom[cnm].prodSelected;
  domCashe.dom[cnm].prodList[lastl].isSelected = false;
  domCashe.dom[cnm].prodList[pnm].isSelected = true;
  domCashe.dom[cnm].prodSelected = pnm;
}

function crRdBt(){
  function rdHandler(){
    var pnm = this.id;
    var cnm = "cat-"+this.name;
    updateRdState(pnm, cnm);
  }
  for(const [nm, ob] of Object.entries(domCashe.dom)){
    var tmpList = ob.selfDom.querySelectorAll("input.part-rd-bt");
    if(tmpList.length){
      ob.prodType = "radio";
      ob.prodList = {};
      for(let i=0;i<tmpList.length;i++){
        tmpList[i].removeEventListener("change",rdHandler);
        tmpList[i].addEventListener("change",rdHandler);
        var dname = tmpList[i].id;
        var cdom = tmpList[i].nextElementSibling;
        ob.prodList[dname] = {
          "selfDom": tmpList[i],
          "cDom": cdom,
          "nmTxt": cdom.querySelector(".part-text-head").innerText,
          "priceVal": cdom.querySelector(".part-price").dataset.priceval,
          "parentCat": nm,
          "isSelected": tmpList[i].checked,
          "value": tmpList[i].value,
        }
        if(ob.prodList[dname].isSelected)ob.prodSelected = dname;
      }
    }
  }
}

function updateCbState(pnm, cnm){
  if(domCashe.dom[cnm].prodSelected.includes(pnm)&&domCashe.dom[cnm].emptyCb==pnm){
    if(domCashe.dom[cnm].prodSelected.length>1){
      domCashe.dom[cnm].prodSelected.splice(domCashe.dom[cnm].prodSelected.indexOf(pnm),1);
      domCashe.dom[cnm].prodList[pnm].isSelected = false;
    }else{
      domCashe.dom[cnm].prodList[pnm].selfDom.checked = true;
    }
  }else if(domCashe.dom[cnm].prodSelected.includes(pnm)){
    if(domCashe.dom[cnm].prodSelected.length<2&&domCashe.dom[cnm].emptyCb == "blank"){
      domCashe.dom[cnm].prodList[pnm].selfDom.checked = true;
    }else{
      domCashe.dom[cnm].prodSelected.splice(domCashe.dom[cnm].prodSelected.indexOf(pnm),1);
      domCashe.dom[cnm].prodList[pnm].isSelected = false;
      if(domCashe.dom[cnm].emptyCb != "blank"){
        var enm = domCashe.dom[cnm].emptyCb;
        if(domCashe.dom[cnm].prodSelected.length<1){
          domCashe.dom[cnm].prodSelected = [enm]
          domCashe.dom[cnm].prodList[enm].isSelected = true;
          domCashe.dom[cnm].prodList[enm].selfDom.checked = true;
        }else if(domCashe.dom[cnm].prodSelected.length>1&&domCashe.dom[cnm].prodSelected.includes(enm)){
          domCashe.dom[cnm].prodSelected.splice(domCashe.dom[cnm].prodSelected.indexOf(enm),1);
          domCashe.dom[cnm].prodList[enm].isSelected = false;
          domCashe.dom[cnm].prodList[enm].selfDom.checked = false;
        }
      }
    }
  }else if(domCashe.dom[cnm].emptyCb==pnm){
    for(const pr of domCashe.dom[cnm].prodSelected){
      domCashe.dom[cnm].prodList[pr].isSelected = false;
      domCashe.dom[cnm].prodList[pr].selfDom.checked = false;
    }
    domCashe.dom[cnm].prodSelected = [pnm]
    domCashe.dom[cnm].prodList[pnm].isSelected = true;
  }else {
    domCashe.dom[cnm].prodSelected.push(pnm);
    domCashe.dom[cnm].prodList[pnm].isSelected = true;
    if(domCashe.dom[cnm].emptyCb != "blank"){
      if(domCashe.dom[cnm].prodSelected.includes(domCashe.dom[cnm].emptyCb)){
        var enm = domCashe.dom[cnm].emptyCb;
        domCashe.dom[cnm].prodSelected.splice(domCashe.dom[cnm].prodSelected.indexOf(enm),1);
        domCashe.dom[cnm].prodList[enm].isSelected = false;
        domCashe.dom[cnm].prodList[enm].selfDom.checked = false;
      }
    }
  }
}

function CbCheck(){
  for(const [nm, ob] of Object.entries(domCashe.dom)){
    if(ob.prodType == "checkbox"){
      if (ob.emptyCb != "blank"){
        if(ob.prodList.length<1){
          ob.prodSelected = [ob.emptyCb]
          ob.prodList[ob.emptyCb].isSelected = true;
          ob.prodList[ob.emptyCb].selfDom.checked = true;
        }else if (ob.prodList.length>1&&ob.prodSelected.includes(ob.emptyCb)){
          ob.prodSelected.splice(ob.prodSelected.indexOf(ob.emptyCb),1);
          ob.prodList[ob.emptyCb].isSelected = false;
          ob.prodList[ob.emptyCb].selfDom.checked = false;
        }
      }
    }
  }
}

function crCbBt(){
  function cbHandler(){
    var pnm = this.id;
    var cnm = "cat-"+this.name;
    updateCbState(pnm, cnm);
  }
  for(const [nm, ob] of Object.entries(domCashe.dom)){
    var tmpList = ob.selfDom.querySelectorAll("input.part-checkbox");
    if(tmpList.length){
      ob.emptyCb = "blank"
      ob.prodType = "checkbox";
      ob.prodSelected = []
      ob.prodList = {};
      for(let i=0;i<tmpList.length;i++){
        tmpList[i].removeEventListener("change",cbHandler);
        tmpList[i].addEventListener("change",cbHandler);
        var dname = tmpList[i].id;
        var cdom = tmpList[i].nextElementSibling;
        ob.prodList[dname] = {
          "selfDom": tmpList[i],
          "cDom": cdom,
          "nmTxt": cdom.querySelector(".part-text-head").innerText,
          "priceVal": cdom.querySelector(".part-price").dataset.priceval,
          "parentCat": nm,
          "isSelected": tmpList[i].checked,
          "value": tmpList[i].value,
        }
        if (ob.prodList[dname].value == "emptyval") ob.emptyCb = dname;
        if(ob.prodList[dname].isSelected)ob.prodSelected.push(dname);
      }
    }else{
      delete ob.emptyCb;
    }
  }
  CbCheck();
}

function catRedirect(wCat, action="toggle",focus="prod") {
  for (const [k, ob] of Object.entries(domCashe.dom)) {
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

function crCOpen(){
  function chHandler(){
    var cName = this.parentElement.id;
    catRedirect(cName);
  }
  for(const ob of Object.values(domCashe.dom)){
    ob.headDom.removeEventListener("click",chHandler);
    ob.headDom.addEventListener("click",chHandler);
  }
}
function crCOpenMinor(){
  function pcHandler(){
    var cName = this.parentElement.parentElement.parentElement.parentElement.parentElement.id;
    catRedirect(cName,"open");
  }
  for(const ob of Object.values(domCashe.dom)){
    if(ob.hasOwnProperty("prodList")){
      for(const pob of Object.values(ob.prodList)){
        var tmpch = pob.cDom.querySelector(".btn-change");
        tmpch.removeEventListener("click",pcHandler);
        tmpch.addEventListener("click",pcHandler);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", function(){
  crCats();
  crRdBt();
  crCbBt();

  crCOpen();
  crCOpenMinor();
})