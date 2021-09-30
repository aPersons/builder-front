import json

with open("product-list.json","r",encoding="UTF-8") as rawjson:
    prodlist = json.loads(rawjson.read())

selected = '<label class="btn btn-primary disabled" >Επιλεγμένο</label>'
cancel = '<label class="btn btn-warning btn-cancel" for="{sel_init}">Ακύρωση</label>'
num_input = """
                  <div class="part-number-input">
                    <input type="number" class="part-quantity"id="{part_id}-quantity" name="{part_cat}-quantity" min="{part_min}" max="{part_max}" value="0">
                    <div class="part-num-decr"><div>-</div></div>
                    <div class="part-num-decr-unavailable"><div>-</div></div>
                    <div class="quantity-display"><div>0</div></div>
                    <div class="part-num-incr"><div>+</div></div>
                    <div class="part-num-incr-unavailable"><div>+</div></div>
                  </div>"""

cat_template="""
            <div class="builder-part-category {cat_name}">
                <div class="part-category-head">{cat_title}</div>
                <div class="part-category-description">{cat_descr}</div>
                <div class="part-list-containter">
                  {part_list}
                </div>
            </div>"""
prod_template = """
            <input type="radio" class="part-rd-bt" id="{part_id}" name="{part_cat}" value="{part_value}"{is_checked} data-erp="{part_erp}" {part_perf}{part_filters}>
            <div class="listed-part">
              <label class="listed-part-inner" for="{part_id}">
                <div class="part-img">
                  <img class="build-img" src="assets/{img_src}.jpg" width="100%">
                </div>
                <div class="part-text"><div class="part-text-head">{part_title}</div>{part_av}</div>
                <div class="part-price">
                  <span class="price-main" data-priceval="{part_price}">0,00€</span>
                  <span class="price-difference">(+0,00€)</span>
                </div>
                <div class="part-btn">{see_more}{use_num_input}
                  <label class="btn btn-primary btn-change" >Αλλαγή</label>
                  <label class="btn btn-primary btn-select" for="{part_id}">Επιλογή</label>
                  {sec_btn}
                  <div class="disabled-part">disabled</div>
                </div>                
              </label>
            </div>"""
av_template={
  "":'<div class="prod-av-null"></div>',
  "Μη διαθέσιμο":'<div class="prod-av-0">Μη διαθέσιμο</div>',
  "Άμεσα διαθέσιμο":'<div class="prod-av-2">Άμεσα διαθέσιμο</div>',
  "1-3 εργάσιμες":'<div class="prod-av-1">1-3 εργάσιμες</div>',
  "1-2 εργάσιμες":'<div class="prod-av-1">1-2 εργάσιμες</div>',
  "10-15 εργάσιμες":'<div class="prod-av-1">10-15 εργάσιμες</div>',
  "Μικρή διαθεσιμότητα":'<div class="prod-av-2">Μικρή διαθεσιμότητα</div>'
}
results=""
for category in prodlist:
    catres=""
    for product in category["product-list"]:        
        if category["init-prod"] == product["prod-code"]:
            ischecked = "checked"
            secbtn = selected
        else:
            ischecked = ""
            secbtn = cancel.format(sel_init = category["init-prod"])
        num_input_res = ""
        if "prod-min" in product and "prod-max" in product:
            num_input_res = num_input.format(
                part_id = product["prod-code"],
                part_cat = category["cat-code"],
                part_min = product["prod-min"],
                part_max = product["prod-max"]
            )
        #get_av = ""
        #if "prod-av" in product:
            #get_av = '<br/><span class="part-av">{part_av}</span>'.format(part_av =product["prod-av"])
        seeMore = ""
        if product["prod-av"] != "":
          seeMore = '<a class="prod-quick-view" href="#"><i class="bi bi-eye"></i>Λεπτομέρειες Προϊόντος</a>'

        perf_list=""
        if category["cat-code"] == "cpu" or category["cat-code"] == "gpu":
          perf_list ='data-perf_fortnite_game="{fortnite}" '.format(fortnite = product["game-perf"]["fortnite_game"])
          perf_list +='data-perf_lol_game="{lol}" '.format(lol = product["game-perf"]["lol_game"])
          perf_list +='data-perf_control_game="{control}" '.format(control = product["game-perf"]["control_game"])
          perf_list +='data-perf_sottr_game="{sottr}"'.format(sottr = product["game-perf"]["sottr_game"])
          perf_list +='data-perf_fs2020_game="{fs2020}"'.format(fs2020 = product["game-perf"]["fs2020_game"])

        filterList = ""
        if "compatibility" in product and "emptyval" not in product:
          for filter, value in product["compatibility"].items():
            filterList += "data-"+filter
            if type(value) == str:
              filterList += '="{0}"'.format(value)
            elif type(value) == list:
              filterList += '="'
              for val in value:
                filterList += val+","
              filterList = filterList[0:len(filterList)-1] + '"'

        catres += prod_template.format(
            part_id = product["prod-code"],
            part_cat = category["cat-code"],
            part_value = (product["prod-code"],"emptyval")["emptyval" in product],
            is_checked = ischecked,
            part_perf = perf_list,
            part_filters = filterList,
            img_src = product["prod-code"],
            part_erp = product["prod-erp"],
            part_title = product["prod-name"],
            part_av = av_template[product["prod-av"]],
            see_more = seeMore,
            part_price = product["prod-price"],
            use_num_input = num_input_res,
            sec_btn = secbtn
        )
    results += cat_template.format(
        cat_name = category["cat-code"],
        cat_title = category["cat-name"],
        cat_descr = category["cat-desc"],
        part_list = catres
    )
with open("template.html","r",encoding="UTF-8") as readtemp:
    results = readtemp.read().format(fill_part_list = results)
with open("index.html","w",encoding="UTF-8") as out:
    out.write(results)
