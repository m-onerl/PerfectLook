export function getParamsHTML(params) {
  return `       
<div class="inputBox">
  <h3>Szerokość</h3>
  <input type="number" id="width"/>
</div>
<div class="inputBox">
  <h3>Wysokość</h3>
  <input type="number" id="height"/>
</div>
<div class="inputBox">
  <h3>Głębokość</h3>
  <input type="number" id="depth" />
</div>
<div class="inputBox">
  <h3>Grubość przedziału</h3>
  <input type="number" id="shelvesWidth"/>
</div>
<div class="inputBox">
  <h3>Minimalna wysokość przedziału</h3>
  <input type="number" id="minRequiredHeight"/>
</div>
`;
}
