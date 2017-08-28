# tableX

A lightweight jQuery plugin which adds Spreadsheet functionality on HTML table built using HTML, JS and JQuery.

It supports external copy paste.

# Setup
1. Create a HTML table with class `tableX`
2. Include `tableX.js` plugin in your HTML
3. Call plugin on the table using `$('.tableX').tableX()`
   - To exclude n rows and n columns from left, right, top and bottom (0 is the start) - 
   `$('.tableX').tableX(index_from_left: n, index_from_top: n, index_from_bottom: n, index_from_right: n)` 
   
# Available functionality

- `click` on the cell to make it active
- `up` `down` `left` `right` arrows for cell navigation
- `click + hold + drag` mouse over cells to multiselect
- `ctrl + c` to copy selected cell data
- `ctrl + v` to paste data (supports external sources)

# Demo

Download the repo and run the demo.html
