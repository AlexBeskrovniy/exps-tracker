//Save form data.
function addRecord() {
	const category_id = Math.floor(Math.random() * 50);
	const category = {
		id: category_id,
		name: document.getElementById('floatingInput').value,
		description: document.getElementById('floatingTextarea').value
	};

	localStorage[category_id] = JSON.stringify(category);
}

//Read all Records from the Storage by the keys.
function allRecords() {
    let values = [];
    let keys = Object.keys(localStorage);
    let i = keys.length;

    while ( i-- ) {
        values.push(JSON.parse(localStorage[keys[i]]) );
    }

    return values;
}

//Insert cards with Categories into template.
function showRecords() {
	let categories = allRecords();

	let card = document.getElementById('output');
	console.log(categories);
	categories.forEach(function(category) {
		card.insertAdjacentHTML('afterbegin', `<div class="d-flex justify-content-center">
													<div class="card bg-dark col-10 mb-3">
														<div class="card-header text-white">
															<h5  class="card-title text-white">
																${category.name}
															</h5>
														</div>
														<div class="card-body">
															<h5 class="card-title text-white">Description</h5>
															<p class="card-text text-white">
																${category.description}
															</p>
														</div>
														<div class="card-footer d-flex justify-content-end">
															<a href="#" class="btn btn-outline-warning me-2">Edit</a>
								    						<form name="delete" onsubmit="delRecord(${category.id});">
																<button type ="submit" class="btn btn-outline-warning me-2">
																	Delete
																</button>
															</form>
								  						</div>
													</div>
												</div>`);
	});
}

//Delete some category
function delRecord(id) {
	if (id) {
		localStorage.removeItem(id);
		console.log("Success");
	} else {
		console.log("Error");
	}
}