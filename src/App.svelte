<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  function KeyPress(e) {
    var evtobj = window.event ? event : e;
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) alert("Ctrl+z");
  }

  document.onkeydown = KeyPress;

  // Create a writable store to hold the list of URLs
  const urlList = writable([]);

  const itemsPerPage = 15; // Set the number of images to display per page
  let currentPage = 0;

  // Function to remove a URL from the list
  function removeUrl(url) {
    urlList.update((urls) => {
      let index = urls.indexOf(url);
      if (index !== -1) {
        urls.splice(index, 1);
      }
      return urls;
    });
  }

  // Function to handle file upload and extract URLs
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const urls = text.split("\n").map((url) => url.trim());
        urlList.set(urls);
      };
      reader.readAsText(file);
    }
  }

  // Function to export URLs to a new text file
  function exportUrls() {
    const urlsToExport = $urlList.join("\n");
    const blob = new Blob([urlsToExport], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "exported_urls.txt";
    a.click();

    // Clean up by revoking the object URL
    URL.revokeObjectURL(url);
  }

  // Initialize the store
  onMount(() => {
    urlList.set([]);
  });

  // Pagination controls
  let paginatedUrls = [];
  $: {
    paginatedUrls = $urlList.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
  }

  function nextPage() {
    if (currentPage < Math.ceil($urlList.length / itemsPerPage) - 1) {
      currentPage += 1;
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage -= 1;
    }
  }
</script>

<main>
  <div>
    <input type="file" accept=".txt" on:change={handleFileUpload} />
  </div>

  <button on:click={exportUrls} class="float-btn contrast" role="button"
    >Export URLs</button
  >

  <div class="custom-grid">
    {#each paginatedUrls as url (url)}
      <article>
        <img src={url} alt="Image" loading="lazy"/>
        <button on:click={() => removeUrl(url)}>Remove</button>
      </article>
    {/each}
  </div>

  <div class="pagination grid">
    <button on:click={prevPage}>Previous</button>
    <span>Page {currentPage + 1}</span>
    <button on:click={nextPage}>Next</button>
  </div>
</main>

<style>
  .custom-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }

  .float-btn {
    max-width: fit-content;
    position: fixed;
    right: 1rem;
    bottom: 1rem;
  }

  main {
    padding: 1em;
  }
</style>
