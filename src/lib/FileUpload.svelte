<script lang="ts">
  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
  };
</script>

<label for="file"
  >Upload file
  <input
    type="file"
    id="file"
    name="file"
    accept=".txt"
    on:change={(e) => onFileSelected(e)}
  />
</label>

<button />
