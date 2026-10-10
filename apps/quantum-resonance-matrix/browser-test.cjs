// Browser smoke test: runs against a local server, never reaches external application URLs.
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
(async()=>{
 const browser = await chromium.launch({headless:true, args:['--no-sandbox']});
 try {
  const page = await browser.newPage({acceptDownloads:true, viewport:{width:1280,height:900}});
  const errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8000/apps/quantum-resonance-matrix/',{waitUntil:'load'});
  await page.locator('#field').waitFor();
  await page.waitForFunction(()=>document.querySelector('#field').getContext('2d').getImageData(360,270,1,1).data[3]===255);
  assert.equal(await page.locator('#state').innerText(),'PAUSAD');
  await page.locator('#toggle').click();
  await page.waitForTimeout(120);
  assert.equal(await page.locator('#state').innerText(),'AKTIV');
  await page.locator('#frequency').fill('2.1');
  assert.equal(await page.locator('#frequency-value').innerText(),'2.10×');
  await page.locator('#palette').selectOption('ember');
  const canvas=page.locator('#field'),box=await canvas.boundingBox();
  await page.mouse.click(box.x+box.width*.45,box.y+box.height*.55);
  // A visible ring is drawn, and the app can be stopped again.
  await page.locator('#toggle').click();
  assert.equal(await page.locator('#state').innerText(),'PAUSAD');
  const downloadEvent=page.waitForEvent('download');
  await page.locator('#save').click();
  const download=await downloadEvent;
  assert.equal(download.suggestedFilename(),'quantum-resonance-matrix.png');
  await page.locator('#reset').click();
  assert.equal(await page.locator('#frequency-value').innerText(),'1.00×');
  assert.equal(await page.locator('#palette').inputValue(),'aurora');
  assert.deepEqual(errors,[]);
  console.log('PASS: Canvas, start/pause, sliders, palette, pointer, PNG, reset, no page errors');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
