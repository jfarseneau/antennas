<script>
  export let title;
  export let fields = [];
</script>

<div class="configuration">
  <table>
    <thead>
      <tr>
        <th colspan=2>{title}</th>
      </tr>
    </thead>
    <tbody>
      {#each fields as field}
        <tr>
          <th>{field.name}</th>
          <td>{field.value}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .configuration {
    display: flex;
    background-color: transparent;

    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: left;

    margin: 22px 0;
  }

  table {
    background-color: #DFDFDF;
  }

  thead tr {
    background-color: yellow;
  }

  tbody tr:nth-child(odd) {
    background-color: #F1F1F1;
  }

  tbody tr:nth-child(even) {
    background-color: #FCFCFC;
  }

  td, .configuration th {
    padding: 5.5px;
    border: 0;
  }
</style>


