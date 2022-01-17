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

function crDom(){

}

document.addEventListener("DOMContentLoaded", function(){

})