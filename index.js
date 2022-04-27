const csv = require("csv-parser");
const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");

const results = [];

const getSPT = (item, separator, wantFirst) => {
  const category = item["Category"];
  let result = wantFirst ? category : "";
  for (let x = 1; x < 9; x++) {
    console.log(item[`Subcategory ${x}`]);
    if (item[`Subcategory ${x}`]) {
      result += `${separator}${item[`Subcategory ${x}`]}`;
    } else break;
  }
  return result;
};

fs.createReadStream("original.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    const mapped = results.map((item, i) => {
      return {
        Handle: item["Item"].replace(" ", "-"),
        Title: item["Item"],
        "Body (HTML)": "",
        Vendor: item["Vendor"],
        "Standardized Product Type": getSPT(item, " > ", true),
        "Custom Product Type": item["Subcategory 2"],
        Tags: getSPT(item, " "),
        Published: item["Publish to eCom"]
          .replace("No", "FALSE")
          .replace("Yes", "TRUE"),
        "Option1 Name": "Title",
        "Option1 Value": item["Item"],
        "Option2 Name": "",
        "Option2 Value": "",
        "Option3 Name": "",
        "Option3 Value": "",
        "Variant SKU": "",
        "Variant Grams": "",
        "Variant Inventory Tracker": "",
        "Variant Inventory Qty": "",
        "Variant Inventory Policy": "",
        "Variant Fulfillment Service": "",
        "Variant Price": "",
        "Variant Compare At Price": "",
        "Variant Requires Shipping": "",
        "Variant Taxable": "",
        "Variant Barcode": "",
        "Image Src": "",
        "Image Position": "",
        "Image Alt Text": "",
        "Gift Card": "FALSE",
        "SEO Title": item["Item"],
        "SEO Description": item["Item"],
        "Google Shopping / Google Product Category": getSPT(item, " > "),
        "Google Shopping / Gender": item["Subcategory 1"],
        "Google Shopping / Age Group": "",
        "Google Shopping / MPN": "",
        "Google Shopping / AdWords Grouping": item["Subcategory 2"],
        "Google Shopping / AdWords Labels": "",
        "Google Shopping / Condition": "new",
        "Google Shopping / Custom Product": "FALSE",
        "Google Shopping / Custom Label 0": "",
        "Google Shopping / Custom Label 1": "",
        "Google Shopping / Custom Label 2": "",
        "Google Shopping / Custom Label 3": "",
        "Google Shopping / Custom Label 4": "",
        "Variant Image": "",
        "Variant Weight Unit": "g",
        "Variant Tax Code": "",
        "Cost per item": item["MSRP"],
        "Price / International": item["Price"],
        "Compare At Price / International": "",
        Status: "active",
      };
    });
    saveCsv(mapped);
  });

const saveCsv = async (results) => {
  const csv = new ObjectsToCsv(results);

  // Save to file:
  await csv.toDisk("./output.csv");
};
