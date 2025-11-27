let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
let editingIndex = null;

// ------------------- IMAGE COMPRESSOR (FIXED) -------------------
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const maxWidth = 400;
        const scale = maxWidth / img.width;

        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL("image/jpeg", 0.6);
        resolve(compressed);
      };
      img.src = event.target.result;
    };
    reader.onerror = () => reject("Error");
    reader.readAsDataURL(file);
  });
}

// ------------------- UI FUNCTIONS -------------------
function openModal(edit = false, index = null) {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("modalTitle").textContent = edit ? "Edit Recipe" : "Add Recipe";

  if (edit) {
    editingIndex = index;
    const r = recipes[index];
    document.getElementById("recipeName").value = r.name;
    document.getElementById("recipeDetails").value = r.details;
  } else {
    editingIndex = null;
    document.getElementById("recipeName").value = "";
    document.getElementById("recipeDetails").value = "";
  }
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// ------------------- DISPLAY RECIPES -------------------
function displayRecipes(list = recipes) {
  const container = document.getElementById("recipeList");
  container.innerHTML = "";

  list.forEach((r, index) => {
    let div = document.createElement("div");
    div.className = "recipe";

    div.innerHTML = `
      <img src="${r.img || 'default.jpg'}">
      <h3>${r.name}</h3>
      <p>${r.details}</p>

      <div class="actions">
        <button class="edit" onclick="editRecipe(${index})">Edit</button>
        <button class="delete" onclick="deleteRecipe(${index})">Delete</button>
      </div>
    `;

    container.appendChild(div);
  });
}

// ------------------- ADD OR EDIT RECIPE -------------------
document.getElementById("saveRecipe").onclick = async function () {
  let name = document.getElementById("recipeName").value.trim();
  let details = document.getElementById("recipeDetails").value.trim();
  let file = document.getElementById("recipeImg").files[0];

  if (!name || !details) {
    alert("All fields required!");
    return;
  }

  let imageData = file ? await readFileAsDataURL(file) : null;

  const recipeObj = { name, details, img: imageData };

  if (editingIndex !== null) {
    recipes[editingIndex] = recipeObj;
  } else {
    recipes.push(recipeObj);
  }

  localStorage.setItem("recipes", JSON.stringify(recipes));
  displayRecipes();
  closeModal();
};

// ------------------- EDIT -------------------
function editRecipe(i) {
  openModal(true, i);
}

// ------------------- DELETE -------------------
function deleteRecipe(i) {
  if (confirm("Delete this recipe?")) {
    recipes.splice(i, 1);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    displayRecipes();
  }
}

// ------------------- SEARCH -------------------
document.getElementById("search").addEventListener("input", function () {
  const term = this.value.toLowerCase();
  const filtered = recipes.filter(r => r.name.toLowerCase().includes(term));
  displayRecipes(filtered);
});

// ------------------- BUTTON OPEN MODAL -------------------
document.getElementById("addBtn").onclick = () => openModal();
document.getElementById("closeModal").onclick = closeModal;

// ------------------- FIRST LOAD -------------------
displayRecipes();
