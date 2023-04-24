<script>
  import { onMount } from 'svelte';

  import Header from './lib/Header/Header.svelte';
  import Loading from './lib/Loading/Loading.svelte';
  import ConfigSection from './lib/ConfigSection/ConfigSection.svelte';

	let antennasConfig;
  let system;
  let channelSource;
  let virtualDevice;

  onMount(async () => {
    const response = await fetch('api/antennas_config.json');
    antennasConfig = await response.json();
    system = [
      {name: 'Status', value: antennasConfig.status},
      {name: 'URL', value: antennasConfig.antennasUrl},
    ];
    channelSource = [
      {name: 'Name', value: 'Tvheadend'},
      {name: 'Application URL', value: antennasConfig.tvheadendUrl},
      {name: 'Stream URL',value: antennasConfig.tvheadendStreamUrl},
      {name: 'Tuner Count', value: antennasConfig.tunerCount},
      {name: 'Channel Count',value: antennasConfig.channelCount}
    ];
    virtualDevice = [
      {name: 'Name',value: antennasConfig.deviceName},
      {name: 'Manufacturer',value: antennasConfig.deviceManufacturer},
      {name: 'Manufacturer URL',value: antennasConfig.deviceManufacturerUrl},
      {name: 'Model Number',value: antennasConfig.deviceModelNumber},
      {name: 'Firmware Name',value: antennasConfig.deviceFirmwareName},
      {name: 'Firmware Version',value: antennasConfig.deviceFirmwareVersion},
      {name: 'Auth',value: antennasConfig.deviceAuth}
    ];
  })
</script>

<main>
  <Header />
  {#if system === undefined || channelSource === undefined || virtualDevice === undefined}
    <Loading />
  {:else}
    <ConfigSection title="System" fields={system}/>
    <ConfigSection title="Channel Source" fields={channelSource}/>
    <ConfigSection title="Virtual Device" fields={virtualDevice}/>
  {/if}
</main>
