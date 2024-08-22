// Helper JS to load and configure DataTables for the OSU Herbarium library page

// Run on page load
window.onload = function(e){ 

	// If on Drupal, add the table tag for DataTables to hook onto
	if(window.location.origin == "https://bpp.oregonstate.edu") {

		// Create table and add it to the appropriate div
		$(".region-content").append('<table id="library"></table>');
	}

	// Start DataTables
	initDataTables();

} // End page load block


// This initializes and configures the DataTables instance
function initDataTables(){

	// Add Table Styles
	$('#library').addClass("stripe hover cell-border compact");

	// Override datatables selected CSS
	$(":root").css({"--dt-row-selected": "176, 190, 217", "--dt-row-selected-text": "0, 0, 0"});

	// Initialize DataTable, with options
	$('#library').DataTable({

		// DataTables Options

		// Get data from Ajax API call
		ajax: {
	        url: 'https://herbarium.science.oregonstate.edu/library/api.php?data=1',
	        
	        // Modify the returned data
	        dataSrc: function(json) {

	        	// For each array item:
	        	json.data.forEach((arr) => {

	        		// Wrap URL in anchor tag
	        		if(arr[14]){
	        			let url = new URL(arr[14]);
	    				arr[14] = '<a href="' + arr[14] + '" target="_blank">' + url.origin + '</a>';
	        		}

	        		// Add an edit link
	        		arr[16] = '<a href="' + arr[0] + '" onClick="editRow(' + arr[0] + ');">Edit</a>';
	        		
	        		// Return the modified array
	        		return arr;
	        		// return arr.splice(0,1) // Remove the ID column and return
	        	});

	        	// Return modified data
	        	return json.data;
	        }
    	},

		// Disable pagination
		// https://datatables.net/reference/option/paging
	    paging: false, 

	    // Sticky header row
	    // https://datatables.net/extensions/fixedheader/
	    fixedHeader: true, 

	    // Allow reordering columns
	    // https://datatables.net/extensions/colreorder/
	    //colReorder: true,

	    // Add the ability to select rows
	    // https://datatables.net/reference/option/select
	    select: {
	    	style: 'os', 
	    	items: 'row'
	    },

	    // Center the table on the page
	    margin: '0 auto',

	    // Order the elements to control the table (default: lfrtip)
	    // https://datatables.net/reference/option/layout
	    layout: {
	    	topStart: ['buttons'], // ['buttons', 'search']
	    	topEnd: 'info',
	    	// top2Start: {

	    	// 	// SearchPanes
	    	// 	// https://datatables.net/extensions/searchpanes/examples/advanced/columnFilter.html
            // 	searchPanes: {
            //     	columns: [2,3,4],
            //     	initCollapsed: true,
            //     	viewTotal: true
            // 	}
            // },
	    	bottomStart: null,
	    	bottomEnd: null

	    },

	    // Scrolling options to show the header all the time
	    scroller: false, 
	    scrollY: '85vh',

	    // Set column sort order
	    // https://datatables.net/reference/option/order
	    order: [[ 2, 'asc' ], [ 5, 'asc' ]],

	    // Configure data columns
	    columnDefs: [
	    	{targets: 0, sTitle: "ID"},
	    	{targets: 1, sTitle: "Owner"},
	    	{targets: 2, sTitle: "Category", width: "130px"},
	    	{targets: 3, sTitle: "Location"},
	    	{targets: 4, sTitle: "Topic"},
	    	{targets: 5, sTitle: "Title"},
	    	{targets: 6, sTitle: "Edition"},
	    	{targets: 7, sTitle: "Volume"},
	    	{targets: 8, sTitle: "Year"},
	    	{targets: 9, sTitle: "Author"},
	    	{targets: 10, sTitle: "Publisher"},
	    	{targets: 11, sTitle: "ISBN"},
	    	{targets: 12, sTitle: "Call Number"},
	    	{targets: 13, sTitle: "Barcode"},
	    	{targets: 14, sTitle: "URL"},
	    	{targets: 15, sTitle: "Notes"},
	    	//{targets: 16, sTitle: "Edit"},
	    	
	    	// Hide some columns by default
	    	// https://datatables.net/examples/basic_init/hidden_columns.html
	    	{targets: [0,1,10,11,12,13,14], visible: false},

	    	// Search Panes
	    	//{targets: [0,1,5,6,7,8,9,10,11,12,13,14,15], searchPanes: {show: false}},

	    	// Disable searching and ordering
	    	{targets: [6,7], searchable: false, orderable: false},

	    	// Only allow toggling between ascending and descending order sequence
	    	// https://datatables.net/reference/option/columns.orderSequence
	    	{targets: [1,2,3,4,5,8,9,10,11,12,13,14,15], orderSequence: ['desc', 'asc']}

	    ], // End columnDefs

	    // Set up buttons
	    // https://datatables.net/extensions/buttons/
	    buttons: [ 

	        // Button to show/hide columns
    		// https://datatables.net/reference/button/colvis
        	{
        		extend: 'colvis',
        		columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
        	},
        	
        	// Export button containing csv, copy, print, pdf
		    {
                extend: 'collection',
                text: 'Export',
                buttons: [

                	// Print data
                	// https://datatables.net/reference/button/print
                	{
		                extend: 'print',
		                autoPrint: false, // Disable print dialog
		                title: '', // Disable title
		                exportOptions: {
		                    columns: [ ':visible' ], // Use all visible columns

		                    // Use all visible rows, or selected rows if selected
	                    	rows: function ( idx, data, node ) {
						    	var dt = new $.fn.dataTable.Api('#library' );
						    	var selected = dt.rows( { selected: true } ).indexes().toArray();
						   
						    	if( selected.length === 0 || $.inArray(idx, selected) !== -1)
						    		return true;

						    	return false;
							}
		                }
		            },

		            // Copy data to the clipboard
		            // https://datatables.net/reference/button/copy
		            {
		                extend: 'copy',
		                exportOptions: {
		                    columns: [ ':visible' ], // Use all visible columns

		                    // Use all visible rows, or selected rows if selected
		                    rows: function ( idx, data, node ) {
						    	var dt = new $.fn.dataTable.Api('#library' );
						    	var selected = dt.rows( { selected: true } ).indexes().toArray();
						   
						    	if( selected.length === 0 || $.inArray(idx, selected) !== -1)
						    		return true;

						    	return false;
							}
		                }
		            },

		            // CSV export
		            // https://datatables.net/reference/button/csv
                    {
						extend: 'csv',
						filename: 'osc-library-export', // Set a filename
		                exportOptions: {
		                    columns: [ ':visible' ], // Use all visible columns

		                    // Use all visible rows, or selected rows if selected
		                    rows: function ( idx, data, node ) {
						    	var dt = new $.fn.dataTable.Api('#library' );
						    	var selected = dt.rows( { selected: true } ).indexes().toArray();
						   
						    	if( selected.length === 0 || $.inArray(idx, selected) !== -1)
						    		return true;

						    	return false;
							}
		                }
					},

					// Excel export
					// https://datatables.net/reference/button/excel
					{
						extend: 'excel',
						filename: 'osc-library-export', // Set a filename
						title: '', // Disable title
						exportOptions: {
		                    columns: [ ':visible' ], // Use all visible columns

		                    // Use all visible rows, or selected rows if selected
	                    	rows: function ( idx, data, node ) {
						    	var dt = new $.fn.dataTable.Api('#library' );
						    	var selected = dt.rows( { selected: true } ).indexes().toArray();
						   
						    	if( selected.length === 0 || $.inArray(idx, selected) !== -1)
						    		return true;

						    	return false;
							}
		                }
					},

					// PDF export
					// https://datatables.net/reference/button/pdf
		            {
						extend: 'pdf',
						filename: 'osc-library-export', // Set a filename
						orientation: 'landscape', 
						download: 'open',
						title: '', // Disable title
						exportOptions: {
		                    columns: [ ':visible' ], // Use all visible columns

		                    // Use all visible rows, or selected rows if selected
	                    	rows: function ( idx, data, node ) {
						    	var dt = new $.fn.dataTable.Api('#library' );
						    	var selected = dt.rows( { selected: true } ).indexes().toArray();
						   
						    	if( selected.length === 0 || $.inArray(idx, selected) !== -1)
						    		return true;

						    	return false;
							}
		                }
					}
                ]
            },	// End Export Collection
	    ],	// End Buttons

		// Run after the DataTable is constructed
	    initComplete: function () {

	    	// Edit some CSS styles
	    	// Center column title
	    	$('.dt-column-title').css({"margin": "0 auto", "display": "table"});

	    	// Adjust button size
	    	$('.dt-button').css({"padding": "3px 10px 3px 10px"});

	    	// Interate over each column to modify column header
        	this.api().columns().every(function () {

                let column = this;
                let title = column.header().textContent;
                let items = Array.from(column.data().filter((v,i,a)=>a.indexOf(v)==i));
                let elem = ''
                let baseStyle = 'width: calc(100% - 7px); margin-top: 5px; border-radius: 3px; border: 1px solid #888; padding: 2px 5px;';

               	// Disable search box for these columns
                let noSearch = ['Edition', 'Volume'];

                // Configure the html element to append to the header cell
                // Dropdown for Category
                if (title == 'Category') {

                	elem = '<select style="width: calc(100%); margin-top: 5px; border-radius: 3px; border: 1px solid #888; padding: 1px 5px;">';
                	elem += '<option value="<All>">All</option>';
                	items.forEach((item) => {elem += '<option value="' + item + '">' + item + '</option>'});
                	elem += '</select>';

                // Everything else gets a text search input
                } else if (noSearch.indexOf(title) < 0) {

                	// Active search columns
                	elem = '<input type="text" placeholder="All" style="' + baseStyle + '" />';

                } else {

                	// Searching disabled
                	elem = '<input type="text" style="' + baseStyle + ' border: hidden;" disabled/>';
                }

				// Create input element and add event listener
                $(elem).appendTo($(column.header()))

                    // Update search when things change
                    .on('keyup change clear', function () {
                        if (column.search() !== this.value) {

                        	// Special search case for year ranges, when a hyphen is present in the search
                        	if(title == "Year" & this.value.includes("-")) {

                        		// Get the two years in the range
                        		let yrs = this.value.split('-'); 
    
    							// Check to see if both years are 4 digits (won't activate until 2nd year has 4 digits)
                        		if (yrs[1].length == 4 & yrs[0].length == 4) {

                        			// Search for a year range
                        			column.search(function(data, row) {
                        				if(data >= yrs[0] & data <= yrs[1]) {
                        					return true;
                        				} else {
                        					return false;
                        				}
                        			}).draw();
                        		}

                        	} else {

                        		// Allow for special value to reset and show everything (for dropdowns)
                        		if(this.value == '<All>') {

                        			// Empty search
                        			column.search('').draw();
                        		} else {

                        			// Typical search
                        			column.search(this.value).draw();
                        		}
                        	}
                        }
                    })

                    // Disable column reordering when clicking the search box
                    .click(function() {
                    	return false;
                    });
            });
    	}

	}); // End DataTable 
} // End InitDataTables

// ##### Functions to test on Drupal page
// Usage: Run the following block in a JS console to first load this file:
	// let script = document.createElement('script');
	// script.type = 'text/javascript';
	// script.src = 'https://herbarium.science.oregonstate.edu/library/library-datatables.js';
	// document.head.appendChild(script);
// Then run addDataTables()

function addDataTables(){

	// Add DataTables JS (including jQuery)
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://herbarium.science.oregonstate.edu/library/DataTables/datatables.min.js';
	document.head.appendChild(script);

	// Run modifyDrupal() after a delay to ensure that our javascript has loaded. 
	setTimeout(modifyDrupal, 1000);
}

function modifyDrupal() {

	// Add DataTables css (requires jQuery)
	$('head').append('<link href="https://herbarium.science.oregonstate.edu/library/DataTables/datatables.min.css" rel="stylesheet" />');

	// Create table and add it to the appropriate div
	$(".region-content").append('<table id="library"></table>');

	// Initialize DataTables
	initDataTables()

}