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
function updateNumberInput(partDom){
  if(partDom.querySelector(".part-number-input")){
    var inputHead = partDom.querySelector(".part-number-input");
    var inputValue = inputHead.querySelector(".part-quantity");
    var inputMin = Number(inputValue.min);
    var inputMax = Number(inputValue.max);
    if(partDom.previousElementSibling.checked){
      inputValue.disabled = false;
      if(inputValue.value < inputMin || inputValue.value > inputMax){
        inputValue.value = inputMin;
      }
      if(inputValue.value > inputMin){
        inputHead.classList.add("decr-av");
      }else{
        inputHead.classList.remove("decr-av");
      }
      if(inputValue.value < inputMax){
        inputHead.classList.add("incr-av");
      }else{
        inputHead.classList.remove("incr-av");
      }      
    }else{
      inputHead.classList.remove("decr-av","incr-av");
      inputValue.disabled = true;
      inputValue.value = "0";
    }
    inputHead.querySelector(".quantity-display div").innerHTML = inputValue.value;
  }
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
  var priceEl = document.querySelector(".builder-product-inner .build-price-total strong span"); 
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
function updatePerfCarousel(){
  var perf_carousel = document.querySelector("#performance-carousel");
  if(!perf_carousel){return;}
  var gList = [
    "lol_game",
    "fortnite_game",
    "control_game",
    "fs2020_game",
    "sottr_game"
  ]
  for(gName of gList){
    perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p span`).innerHTML = "?";
    perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p span`).innerHTML = "?";
    perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k span`).innerHTML = "?";
    perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p`).classList.remove("over","under","err");
    perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p`).classList.remove("over","under","err");
    perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k`).classList.remove("over","under","err");
    perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p`).setAttribute("data-original-title","");
    perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p`).setAttribute("data-original-title","");
    perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k`).setAttribute("data-original-title","");
  }
  var sel_mb = document.querySelector(".builder-parts .builder-part-category.mitriki input:checked");
  var sel_cpu = document.querySelector(".builder-parts .builder-part-category.cpu input:checked");
  var sel_ram = document.querySelector(".builder-parts .builder-part-category.ram input:checked");
  var sel_gpu = document.querySelector(".builder-parts .builder-part-category.gpu input:checked");
  if(!(sel_mb && sel_cpu && sel_ram && sel_gpu)){
    for(gName of gList){
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p`).classList.add("err");
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p`).classList.add("err");
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k`).classList.add("err");
    }
    return;
  }
  if((sel_mb.disabled || sel_cpu.disabled || sel_ram.disabled || sel_gpu.disabled)){
    for(gName of gList){
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p`).classList.add("err");
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p`).classList.add("err");
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k`).classList.add("err");
    }
    return;
  }
  var missingText = "";
  if(sel_mb.value == "emptyval"){missingText += "Χρειάζεσαι Μητρική<br/>";}
  if(sel_cpu.value == "emptyval"){missingText += "Χρειάζεσαι Επεξεργαστή<br/>";}
  if(sel_ram.value == "emptyval"){missingText += "Χρειάζεσαι Μνήμη RAM<br/>";}
  if(sel_gpu.value == "emptyval"){missingText += "Χρειάζεσαι Κάρτα Γραφικών<br/>";}
  if(missingText.length){
    for(gName of gList){
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p span`).innerHTML = "No";
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p span`).innerHTML = "No";
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k span`).innerHTML = "No";  
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p`).classList.add("under");
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p`).classList.add("under");
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k`).classList.add("under");
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p`).setAttribute("data-original-title",missingText.substring(0,missingText.length-5));
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p`).setAttribute("data-original-title",missingText.substring(0,missingText.length-5));
      perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k`).setAttribute("data-original-title",missingText.substring(0,missingText.length-5));
    }
  }else{
    for(gName of gList){
      //1080p
      var perfText = "";
      if(sel_cpu.getAttribute(`data-perf_${gName}`) < 1){perfText += "Ο Επεξεργαστής είναι ανεπαρκής<br/>";}
      if(sel_gpu.getAttribute(`data-perf_${gName}`) < 1){perfText += "Η Κάρτα Γραφικών είναι ανεπαρκής<br/>";}
      if(!perfText.length){
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p span`).innerHTML = "Yes";
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p`).classList.add("over");
      }else{
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p span`).innerHTML = "Yes";
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p`).classList.add("under");
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1080p`).setAttribute("data-original-title", perfText.substring(0,perfText.length-5))
      }
      //1440p
      perfText = "";
      if(sel_cpu.getAttribute(`data-perf_${gName}`) < 2){perfText += "Ο Επεξεργαστής είναι ανεπαρκής<br/>";}
      if(sel_gpu.getAttribute(`data-perf_${gName}`) < 2){perfText += "Η Κάρτα Γραφικών είναι ανεπαρκής<br/>";}
      if(!perfText.length){
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p span`).innerHTML = "Yes";
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p`).classList.add("over");
      }else{
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p span`).innerHTML = "Yes";
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p`).classList.add("under");
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-1440p`).setAttribute("data-original-title", perfText.substring(0,perfText.length-5))
      }
      //4k
      perfText = "";
      if(sel_cpu.getAttribute(`data-perf_${gName}`) < 3){perfText += "Ο Επεξεργαστής είναι ανεπαρκής<br/>";}
      if(sel_gpu.getAttribute(`data-perf_${gName}`) < 3){perfText += "Η Κάρτα Γραφικών είναι ανεπαρκής<br/>";}
      if(!perfText.length){
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k span`).innerHTML = "Yes";
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k`).classList.add("over");
      }else{
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k span`).innerHTML = "Yes";
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k`).classList.add("under");
        perf_carousel.querySelector(`.c-overlay-inner.${gName} .carousel-4k`).setAttribute("data-original-title", perfText.substring(0,perfText.length-5))
      }
    }
  }  
}

function catRedirect(nextCat) {
  var gtopen = document.querySelectorAll(".builder-part-category.lp-show");
  for (let y = 0; y < gtopen.length; y++) {
    if(gtopen[y].classList.contains("lp-show")){
      gtopen[y].classList.remove("lp-show");
    }
  }
  if(nextCat.classList.contains("builder-part-category")){
    nextCat.classList.toggle("lp-show",true);
  }
  if(window.innerWidth > 991){
    window.scrollTo(0,nextCat.getBoundingClientRect().top+window.pageYOffset-85);
  }else{
    window.scrollTo(0,nextCat.getBoundingClientRect().top+window.pageYOffset-123);
  }
}
function avCompatible(){
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
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με την επιλεγμένη <span>Μητρική</span>.`;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part span").addEventListener("click",function(){
                    catRedirect(document.querySelector(".builder-part-category.mitriki"));
                  });
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
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με το επιλεγμένο <span>Κουτί</span>.`;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part span").addEventListener("click",function(){
                    catRedirect(document.querySelector(".builder-part-category.kouti"));
                  });
                  break;
                }
              }
            }
            partCheck = document.querySelector(".builder-parts .builder-part-category.cpu input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(! (partList[y].getAttribute("data-socket") == partCheck.getAttribute("data-socket"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με τον επιλεγμένο <span>Επεξεργαστή</span>.`;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part span").addEventListener("click",function(){
                    catRedirect(document.querySelector(".builder-part-category.cpu"));
                  });
                  break;
                }
              }
            }
            partCheck = document.querySelector(".builder-parts .builder-part-category.psiktra input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(! partCheck.getAttribute("data-socket").split(",").includes(partList[y].getAttribute("data-socket"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με την επιλεγμένη <span>Ψύξη επεξεργαστή</span>.`;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part span").addEventListener("click",function(){
                    catRedirect(document.querySelector(".builder-part-category.psiktra"));
                  });
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
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με την επιλεγμένη <span>Μητρική</span>.`;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part span").addEventListener("click",function(){
                    catRedirect(document.querySelector(".builder-part-category.mitriki"));
                  });
                  break;
                }
              }
            }
            partCheck = document.querySelector(".builder-parts .builder-part-category.psiktra input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(! partCheck.getAttribute("data-socket").split(",").includes(partList[y].getAttribute("data-socket"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με την επιλεγμένη <span>Ψύξη επεξεργαστή</span>.`;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part span").addEventListener("click",function(){
                    catRedirect(document.querySelector(".builder-part-category.psiktra"));
                  });
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
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με τον επιλεγμένο <span>Επεξεργαστή</span>.`;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part span").addEventListener("click",function(){
                    catRedirect(document.querySelector(".builder-part-category.cpu"));
                  });
                  break;
                }
              }
            }
            partCheck = document.querySelector(".builder-parts .builder-part-category.mitriki input.part-rd-bt:checked");
            if(partCheck){
              if(partCheck.value != "emptyval"){
                if(! partList[y].getAttribute("data-socket").split(",").includes(partCheck.getAttribute("data-socket"))){
                  partList[y].disabled = true;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part").innerHTML = `Το προϊόν δεν είναι συμβατό με την επιλεγμένη <span>Μητρική</span>.`;
                  partList[y].nextElementSibling.querySelector(".part-btn .disabled-part span").addEventListener("click",function(){
                    catRedirect(document.querySelector(".builder-part-category.mitriki"));
                  });
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
  updatePerfCarousel();
}

function createListeners(){
  var acc = document.querySelectorAll(".builder-part-category > .part-category-head");
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      var gtopen = document.querySelectorAll(".builder-part-category.lp-show");      
      var part_category = this.parentElement;
      if(part_category.classList.contains("builder-part-category")){
        part_category.classList.toggle("lp-show");
      }
      for (let y = 0; y < gtopen.length; y++) {
        if(gtopen[y].classList.contains("lp-show")){
          gtopen[y].classList.remove("lp-show");
        }
      }if(window.innerWidth>991){
        window.scrollTo(0,part_category.getBoundingClientRect().top+window.pageYOffset-85)
      }else{
        window.scrollTo(0,part_category.getBoundingClientRect().top+window.pageYOffset-123)
      }
    })
  }

  acc = document.querySelectorAll(".builder-part-category label.btn-change");
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      var gtopen = document.querySelectorAll(".builder-part-category.lp-show");      
      var part_category = this.parentElement.parentElement.parentElement.parentElement;
      if(part_category.classList.contains("builder-part-category")){
        part_category.classList.toggle("lp-show");
      }
      for (let y = 0; y < gtopen.length; y++) {
        if(gtopen[y].classList.contains("lp-show")){
          gtopen[y].classList.remove("lp-show");
        }
      }
      if(window.innerWidth>991){
        window.scrollTo(0,part_category.getBoundingClientRect().top+window.scrollY-85);
      }else{
        window.scrollTo(0,part_category.getBoundingClientRect().top+window.scrollY-123);
      }
    })
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
      updatePerfCarousel();
    })
  }

  acc = document.querySelectorAll(".builder-part-category .part-number-input > input.part-quantity ~ .part-num-decr");
  for(let i = 0; i < acc.length; i++){
    acc[i].addEventListener("click", function() {
      var loctemp = this.parentElement.parentElement.parentElement.parentElement;
      var inputHead = loctemp.querySelector(".part-number-input");
      var inputValue = inputHead.querySelector(".part-quantity");
      var inputMin = Number(inputValue.min);
      var inputMax = Number(inputValue.max);
      if(loctemp.previousElementSibling.checked){
        inputValue.disabled = false;
        if(inputValue.value >= inputMin && inputValue.value <= inputMax){
          if(inputValue.value > inputMin){
            inputValue.value--;
          }
        }else{
          inputValue.value = inputMin;
        }
        if(inputValue.value > inputMin){
          inputHead.classList.add("decr-av");
        }else{
          inputHead.classList.remove("decr-av");
        }
        if(inputValue.value < inputMax){
          inputHead.classList.add("incr-av");
        }else{
          inputHead.classList.remove("incr-av");
        }
      }else{
        inputHead.classList.remove("decr-av","incr-av");
        inputValue.disabled = true
        inputValue.value = "0";
      }
      loctemp.querySelector(".quantity-display div").innerHTML = inputValue.value;
      updateFinalPrice();
      updatePerfCarousel()
    })
  }

  acc = document.querySelectorAll(".builder-part-category .part-number-input > input.part-quantity ~ .part-num-incr");
  for(let i = 0; i < acc.length; i++){
    acc[i].addEventListener("click", function() {
      var loctemp = this.parentElement.parentElement.parentElement.parentElement;
      var inputHead = loctemp.querySelector(".part-number-input");
      var inputValue = inputHead.querySelector(".part-quantity");
      var inputMin = Number(inputValue.min);
      var inputMax = Number(inputValue.max);
      if(loctemp.previousElementSibling.checked){
        inputValue.disabled = false;
        if(inputValue.value >= inputMin && inputValue.value <= inputMax){
          if(inputValue.value < inputMax){
            inputValue.value++;
          }
        }else{
          inputValue.value = inputMin;
        }
        if(inputValue.value > inputMin){
          inputHead.classList.add("decr-av");
        }else{
          inputHead.classList.remove("decr-av");
        }
        if(inputValue.value < inputMax){
          inputHead.classList.add("incr-av");
        }else{
          inputHead.classList.remove("incr-av");
        }
      }else{
        inputHead.classList.remove("decr-av","incr-av");
        inputValue.disabled = true;
        inputValue.value = "0";
      }
      loctemp.querySelector(".quantity-display div").innerHTML = inputValue.value;
      updateFinalPrice();
      updatePerfCarousel()
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

  //temp
  document.addEventListener("scroll",function(){
    var navbar = document.querySelector(".header-main");
    if(navbar.classList.contains("nav-fix-top") && window.scrollY > 130 && window.innerWidth > 991){
      navbar.classList.add("nav-fix-top");
    }else if(window.scrollY > 190 && window.innerWidth > 991){
      navbar.classList.add("nav-fix-top");
    }else if(window.scrollY > 167 && window.innerWidth < 992){
      navbar.classList.add("nav-fix-top");
    }else{
      navbar.classList.remove("nav-fix-top");
    }
  })
}
document.addEventListener("DOMContentLoaded", function(){
  $('.c-overlay-inner [data-toggle="tooltip"]').tooltip();
  createListeners();
  initParts();}
)