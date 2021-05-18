$(function () {
  loadProducts();
  $("#products").on("click", ".btn-danger", handleDelete);
  $("#products").on("click", ".btn-info", handleUpdate);
  $("#addButton").click(addProduct);
  $("#searchButton").click(getOneProduct);
  $("#reloadButton").click(loadProducts);
});

function loadProducts() {
  $.ajax({
    url: "https://usman-recipes.herokuapp.com/api/products",
    method: "GET",
    success: function (response) {
      console.log(response);
      var products = $("#products");
      products.empty();

      for (var i = 0; i < response.length; i++) {
        products.append(
          `<div class="product" product-id="${response[i]._id}">
              <h3>${response[i].name}</h3>
              <p>
              Price: ${response[i].price}<br />
              Color: ${response[i].color}<br />
              Department: ${response[i].department}<br />
              ${response[i].description}<br />
              </p>
              <button class="btn btn-info btn-sm">Edit</button>
              <button class="btn btn-danger btn-sm">Delete</button>
              </div>`
        );
      }
    },
  });
}

function getOneProduct() {
  var searchIdField = $("#searchID");
  var searchID = searchIdField.val();
  searchIdField.val("");

  if (searchID.length == 0) {
    var products = $("#products");
    products.html("NO ID WAS GIVEN");
    return;
  }

  $.ajax({
    url: "https://usman-recipes.herokuapp.com/api/products/" + searchID,
    method: "GET",
    success: function (response) {
      var products = $("#products");
      products.empty();

      products.append(
        `<div class="product" product-id="${response._id}">
            <h3>${response.name}</h3>
            <p>
            Price: ${response.price}<br />
            Color: ${response.color}<br />
            Department: ${response.department}<br />
            ${response.description}<br />
            </p>
            <button class="btn btn-info btn-sm">Edit</button>
            <button class="btn btn-danger btn-sm">Delete</button>
            </div>`
      );
    },
    error: function (xhr, status, error) {
      var products = $("#products");
      products.html("BAD REQUEST. NO PRODUCT WITH THIS ID WAS FOUND");
    },
  });
}

function handleUpdate() {
  var button = $(this);
  var parentDiv = button.closest(".product");
  let id = parentDiv.attr("product-id");

  $.get(
    "https://usman-recipes.herokuapp.com/api/products/" + id,
    function (response) {
      $("#updateID").val(response._id);
      $("#updatedName").val(response.name);
      $("#updatedPrice").val(response.price);
      $("#updatedColor").val(response.color);
      $("#updatedDepartment").val(response.department);
      $("#updatedDescription").val(response.description);

      $("#updateModal").modal("show");
    }
  );

  $("#updateModalButton").click(function () {
    var name = $("#updatedName").val();
    var price = $("#updatedPrice").val();
    var color = $("#updatedColor").val();
    var department = $("#updatedDepartment").val();
    var description = $("#updatedDescription").val();

    $.ajax({
      url: "https://usman-recipes.herokuapp.com/api/products/" + id,
      data: { name, price, color, department, description },
      method: "PUT",
      success: function (response) {
        loadProducts();
      },
    });

    $("#updateModal").modal("hide");
  });
}

function addProduct() {
  $("#addModal").modal("show");

  $("#addModalButton").click(function () {
    var name = $("#addName").val();
    var price = $("#addPrice").val();
    var color = $("#addColor").val();
    var department = $("#addDepartment").val();
    var description = $("#addDescription").val();

    $.ajax({
      url: "https://usman-recipes.herokuapp.com/api/products",
      method: "POST",
      data: { name, price, color, department, description },
      success: function () {
        loadProducts();
      },
    });

    $("#addModal").modal("hide");
  });
}

function handleDelete() {
  var button = $(this);
  var parentDiv = button.closest(".product");
  let id = parentDiv.attr("product-id");

  $.ajax({
    url: "https://usman-recipes.herokuapp.com/api/products/" + id,
    method: "DELETE",
    success: function () {
      loadProducts();
    },
  });
}
