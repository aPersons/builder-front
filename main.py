import json

with open("product-list.json","r",encoding="UTF-8") as rawjson:
    prodlist = json.loads(rawjson.read())

for y in range(20):
  prodlist.append({
    "cat-code": f"test{y}",
    "cat-name": f"testcat{y}",
    "cat-desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "init-prod": f"test{y}-0",
    "product-list": []
  })
  for x in range(100):
    prodlist[-1]["product-list"].append({
      "prod-code":prodlist[-1]['cat-code']+f'-{x}',
      "prod-price":f"{100*x}",
      "prod-av":"",
      "prod-name":f"{'emptyval'if x==0 else prodlist[-1]['cat-code']+f'-{x}'}"
    })
    if x==0:
      prodlist[-1]["product-list"][-1]["emptyval"]="emptyval"

selected = '<label class="btn btn-success disabled" >Επιλεγμένο</label>'
cancel = '<label class="btn btn-primary btn-cancel btn-shadow" for="{sel_init}">Ακύρωση</label>'
num_input = """
  <div class="part-number-input">
    <input type="number" class="part-quantity"id="{part_id}-quantity" name="{part_cat}-quantity{mlfx}" min="{part_min}" max="{part_max}" value="0">
    <i class="bi bi-dash part-num-decr"></i>
    <span class="quantity-display">0</span>
    <i class="bi bi-plus part-num-incr"></i>
  </div>
"""
num_input_alt = """
  <div class="part-number-input static-number">
    <input type="number" class="part-quantity"id="{part_id}-quantity" name="{part_cat}-quantity{mlfx}" value="1">
  </div>
"""

cat_template="""
            <div class="builder-part-category {cat_name}" id="cat-{cat_name}">
                <div class="part-category-head">{cat_title}</div>
                <div class="part-category-description">{cat_descr}</div>
                <div class="part-list-container-outer">
                <div class="part-list-container">
                  {part_list}
                </div></div>
            </div>"""
prod_template = """
            <input type="{input_type}" class="{sel_type}" id="{part_id}" name="{part_cat}{mlfx}" value="{part_value}"{is_checked}{part_erp}{perfattr}{compattr}>
            <div class="listed-part">              
              <label class="listed-part-inner" for="{part_id}">
                <div class="part-img">
                  <img class="build-img" src="assets/{img_src}.jpg" width="100%">
                </div>
                <div class="part-text"><div class="part-text-head">{part_title}</div>{part_av}</div>
                <div class="part-price" data-priceval="{part_price}">
                  <span class="price-block">0,00€</span>
                </div>
                <div class="part-btn">{see_more}{use_num_input}
                  <label class="btn btn-success btn-change btn-shadow">Αλλαγή</label>
                  <label class="btn btn-success btn-select btn-shadow" for="{part_id}">Επιλογή</label>
                  {sec_btn}
                  <div class="disabled-part">disabled</div>
                </div>                
              </label>              
            </div><div class="border-top pt-3 mt-3"></div>"""
av_template={
  "":'<div class="prod-av-null"></div>',
  "Μη διαθέσιμο":'<div class="prod-av-0">Μη διαθέσιμο</div>',
  "Άμεσα διαθέσιμο":'<div class="prod-av-2">Άμεσα διαθέσιμο</div>',
  "1-3 εργάσιμες":'<div class="prod-av-1">1-3 εργάσιμες</div>',
  "1-2 εργάσιμες":'<div class="prod-av-1">1-2 εργάσιμες</div>',
  "5-10 εργάσιμες":'<div class="prod-av-1">1-2 εργάσιμες</div>',
  "10-15 εργάσιμες":'<div class="prod-av-1">10-15 εργάσιμες</div>',
  "Μικρή διαθεσιμότητα":'<div class="prod-av-2">Μικρή διαθεσιμότητα</div>'
}
results=""
for category in prodlist:
    catres=""
    for product in category["product-list"]:
      if "multi-sel" in category:
        if category["init-prod"] == product["prod-code"]:
          ischecked = " checked"
          secbtn = selected
        else:
          ischecked= ""
          secbtn = cancel.format(sel_init = product["prod-code"])
      else:
        if category["init-prod"] == product["prod-code"]:
            ischecked = " checked"
            secbtn = selected
        else:
            ischecked = ""
            secbtn = cancel.format(sel_init = category["init-prod"])

      num_input_res = ""
      if "prod-min" in product and "prod-max" in product:
          num_input_res = num_input.format(
              mlfx = "[]"if "multi-sel" in category else "",
              part_id = product["prod-code"],
              part_cat = category["cat-code"],
              part_min = product["prod-min"],
              part_max = product["prod-max"]
          )
      else:
        num_input_res = num_input_alt.format(
              mlfx = "[]"if "multi-sel" in category else "",
              part_id = product["prod-code"],
              part_cat = category["cat-code"]
        )
      #get_av = ""
      #if "prod-av" in product:
          #get_av = '<br/><span class="part-av">{part_av}</span>'.format(part_av =product["prod-av"])
      seeMore = ""
      if not "emptyval" in product:
        seeMore = '<a class="prod-quick-view quick-view-btn" data-productid="26356" href="#quick-view" data-bs-toggle="modal"><i class="bi bi-eye"></i>Λεπτομέρειες Προϊόντος</a>'

      perfAttributes = ""
      perfres = ""
      if "perf-data" in product and "emptyval" not in product:
        for atr in product["perf-data"]:
          perfAttributes += atr+","
        perfres =' data-perfattr="'+perfAttributes[:len(perfAttributes)-1]+'"'


      compAttributes = ""
      compres = ""
      if "comp-data" in product and "emptyval" not in product:
        for fltr in product["comp-data"]:
          for atr in fltr:
            compAttributes += atr+","
          compAttributes = compAttributes[:len(compAttributes)-1]+";"
        compres =' data-compattr="'+compAttributes[:len(compAttributes)-1]+'"'

      catres += prod_template.format(
        input_type = "checkbox" if "multi-sel" in category else "radio",
        sel_type = "part-checkbox" if "multi-sel" in category else "part-rd-bt",
        part_id = product["prod-code"],
        part_cat = category["cat-code"],
        mlfx = "[]"if "multi-sel" in category else "",
        part_value = (product["prod-code"],"emptyval")["emptyval" in product],
        is_checked = ischecked,
        perfattr = perfres,
        compattr = compres,
        img_src = "kouti0" if "test" in product["prod-code"] else product["prod-code"],
        part_erp = ' data-erp="{0}"'.format(product["prod-erp"])if "prod-erp" in product else "",
        part_title = product["prod-name"],
        part_av = av_template[product["prod-av"]],
        see_more = seeMore,
        part_price = product["prod-price"],
        price_difference = ""if "multi-sel" in category else '<span class="price-difference">+0,00€</span>',
        use_num_input = num_input_res,
        sec_btn = secbtn
      )
    results += cat_template.format(
        cat_name = category["cat-code"],
        cat_title = category["cat-name"],
        cat_descr = category["cat-desc"],
        part_list = catres[:len(catres)-40]
    )
with open("template.html","r",encoding="UTF-8") as readtemp:
    results = readtemp.read().format(fill_part_list = results)
with open("index.html","w",encoding="UTF-8") as out:
    out.write(results)
