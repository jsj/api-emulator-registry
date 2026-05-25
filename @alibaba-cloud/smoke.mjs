import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'alibaba-cloud');

const regions = await harness.call('GET', '/?Action=DescribeRegions&Version=2014-05-26');
assert.equal(regions.payload.Regions.Region[0].RegionId, 'cn-hangzhou');

const zones = await harness.call('GET', '/?Action=DescribeZones&Version=2014-05-26&RegionId=cn-hangzhou');
assert.equal(zones.payload.Zones.Zone[0].ZoneId, 'cn-hangzhou-h');

const vpcs = await harness.call('GET', '/?Action=DescribeVpcs&Version=2016-04-28&RegionId=cn-hangzhou');
assert.equal(vpcs.payload.Vpcs.Vpc[0].VpcId, 'vpc-emulator001');

const instances = await harness.call('GET', '/?Action=DescribeInstances&Version=2014-05-26&RegionId=cn-hangzhou');
assert.equal(instances.payload.Instances.Instance[0].InstanceId, 'i-emulator001');

const stopped = await harness.call('POST', '/?Action=StopInstance&Version=2014-05-26&InstanceId=i-emulator001');
assert.equal(stopped.payload.RequestId, '7F4B6E64-EMULATOR-4F3C-9E2E-000000000001');

const afterStop = await harness.call('GET', '/?Action=DescribeInstances&Version=2014-05-26&InstanceIds=["i-emulator001"]');
assert.equal(afterStop.payload.Instances.Instance[0].Status, 'Stopped');

const created = await harness.call('POST', '/?Action=CreateInstance&Version=2014-05-26&RegionId=cn-hangzhou&InstanceName=emulator-created');
assert.equal(created.payload.InstanceId, 'i-emulator002');

console.log('alibaba-cloud smoke ok');
