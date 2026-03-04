// Central app logic for converters. Functions are defensive (check element existence).
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (typeof updateThemeButton === 'function') updateThemeButton();
    if (typeof updateUnitDisplay === 'function' && document.getElementById('unitType')) updateUnitDisplay();
    const cp = document.getElementById('colorPicker');
    if (cp) { cp.value = '#667eea'; if (typeof updateColorFromPicker === 'function') updateColorFromPicker(); }
});

function showSection(id, event) {
    document.querySelectorAll('.converter-section').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const text = element.value || element.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        const original = element.textContent || element.placeholder;
        element.textContent = '✓ Kopiert!';
        setTimeout(() => element.textContent = original, 1500);
    }).catch(() => alert('Fehler beim Kopieren!'));
}

function textToBinary() {
    const el = document.getElementById('textInput');
    if (!el) return;
    const text = el.value;
    let binary = '';
    for (let i = 0; i < text.length; i++) {
        binary += text.charCodeAt(i).toString(2).padStart(8, '0') + ' ';
    }
    const out = document.getElementById('binaryOutput'); if (out) out.textContent = binary.trim() || '(leer)';
}

function binaryToText() {
    const el = document.getElementById('binaryInput'); if (!el) return;
    const binary = el.value;
    let text = '';
    try {
        binary.trim().split(' ').forEach(byte => { if (byte) text += String.fromCharCode(parseInt(byte, 2)); });
        const out = document.getElementById('textOutput'); if (out) out.textContent = text || '(leer)';
    } catch(e) { const out = document.getElementById('textOutput'); if (out) out.textContent = 'Fehler!'; }
}

function updateColorFromPicker() {
    const cp = document.getElementById('colorPicker'); if (!cp) return;
    const hexIn = document.getElementById('hexInput'); if (hexIn) hexIn.value = cp.value;
    if (typeof updateColorFromHex === 'function') updateColorFromHex();
}

function updateColorFromHex() {
    const hexEl = document.getElementById('hexInput'); if (!hexEl) return;
    let hex = hexEl.value.trim(); if (!hex.startsWith('#')) hex = '#' + hex;
    if (!/^#[0-9A-F]{6}$/i.test(hex)) return;
    const prev = document.getElementById('colorPreview'); if (prev) prev.style.backgroundColor = hex;
    const cp = document.getElementById('colorPicker'); if (cp) cp.value = hex;
    const r = parseInt(hex.substr(1,2),16); const g = parseInt(hex.substr(3,2),16); const b = parseInt(hex.substr(5,2),16);
    const rEl = document.getElementById('redInput'); if (rEl) rEl.value = r;
    const gEl = document.getElementById('greenInput'); if (gEl) gEl.value = g;
    const bEl = document.getElementById('blueInput'); if (bEl) bEl.value = b;
    const rgbOut = document.getElementById('rgbOutput'); if (rgbOut) rgbOut.textContent = `rgb(${r}, ${g}, ${b})`;
    if (typeof updateHSLFromRGB === 'function') updateHSLFromRGB(r,g,b);
}

function updateColorFromRGB() {
    const r = parseInt(document.getElementById('redInput')?.value) || 0;
    const g = parseInt(document.getElementById('greenInput')?.value) || 0;
    const b = parseInt(document.getElementById('blueInput')?.value) || 0;
    const hex = '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
    const hexEl = document.getElementById('hexInput'); if (hexEl) hexEl.value = hex;
    const prev = document.getElementById('colorPreview'); if (prev) prev.style.backgroundColor = hex;
    const cp = document.getElementById('colorPicker'); if (cp) cp.value = hex;
    const rgbOut = document.getElementById('rgbOutput'); if (rgbOut) rgbOut.textContent = `rgb(${r}, ${g}, ${b})`;
    if (typeof updateHSLFromRGB === 'function') updateHSLFromRGB(r,g,b);
}

function updateHSLFromRGB(r,g,b){
    r/=255; g/=255; b/=255; const max=Math.max(r,g,b), min=Math.min(r,g,b); let h,s,l=(max+min)/2;
    if(max===min){h=s=0;}else{const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min); switch(max){case r: h=((g-b)/d + (g<b?6:0))/6; break; case g: h=((b-r)/d + 2)/6; break; case b: h=((r-g)/d + 4)/6; break;}}
    h=Math.round(h*360); s=Math.round(s*100); l=Math.round(l*100);
    const hEl=document.getElementById('hueInput'); if(hEl) hEl.value=h; const sEl=document.getElementById('satInput'); if(sEl) sEl.value=s; const lEl=document.getElementById('lightInput'); if(lEl) lEl.value=l;
    const hOut=document.getElementById('hslOutput'); if(hOut) hOut.textContent=`hsl(${h}, ${s}%, ${l}%)`;
}

function updateColorFromHSL(){
    const h=parseInt(document.getElementById('hueInput')?.value||0)/360; const s=parseInt(document.getElementById('satInput')?.value||0)/100; const l=parseInt(document.getElementById('lightInput')?.value||0)/100;
    let r,g,b; if(s===0){r=g=b=l;}else{const hue2rgb=(p,q,t)=>{if(t<0) t+=1; if(t>1) t-=1; if(t<1/6) return p+(q-p)*6*t; if(t<1/2) return q; if(t<2/3) return p+(q-p)*(2/3-t)*6; return p}; const q=l<0.5?l*(1+s):l+s-l*s; const p=2*l-q; r=hue2rgb(p,q,h+1/3); g=hue2rgb(p,q,h); b=hue2rgb(p,q,h-1/3);} const toHex=x=>Math.round(x*255).toString(16).padStart(2,'0'); const hex='#'+(toHex(r)+toHex(g)+toHex(b)).toUpperCase(); const hexEl=document.getElementById('hexInput'); if(hexEl) hexEl.value=hex; const prev=document.getElementById('colorPreview'); if(prev) prev.style.backgroundColor=hex; const cp=document.getElementById('colorPicker'); if(cp) cp.value=hex;
}

const unitTypes = {
    length: { units: { 'm':1,'km':0.001,'cm':100,'mm':1000,'mi':0.000621371,'yd':1.09361,'ft':3.28084,'in':39.3701 }, labels: { 'm':'Meter','km':'Kilometer','cm':'Zentimeter','mm':'Millimeter','mi':'Meilen','yd':'Yards','ft':'Fuß','in':'Zoll' } },
    weight: { units: { 'kg':1,'g':1000,'mg':1000000,'lb':2.20462,'oz':35.274,'t':0.001 }, labels: { 'kg':'Kilogramm','g':'Gramm','mg':'Milligramm','lb':'Pfund','oz':'Unzen','t':'Tonnen' } },
    temperature: { convert: (val,from,to)=>{ if(from===to) return val; if(from==='C') return to==='F'?val*9/5+32:val+273.15; if(from==='F') return to==='C'?(val-32)*5/9:(val-32)*5/9+273.15; if(from==='K') return to==='C'?val-273.15:(val-273.15)*9/5+32; return val }, labels:{'C':'Celsius','F':'Fahrenheit','K':'Kelvin'} }
};

function updateUnitDisplay(){
    const typeEl=document.getElementById('unitType'); if(!typeEl) return; const type=typeEl.value; const container=document.getElementById('unitInputs'); if(!container) return;
    let html='<div class="input-group"><label>Konvertiere:</label><div class="input-row">';
    if(type==='temperature'){['C','F','K'].forEach(u=>{html+=`<input type="number" placeholder="${unitTypes.temperature.labels[u]}" id="unit_${u}" onchange="convertUnits()">`;});}
    else{Object.keys(unitTypes[type].units).forEach(u=>{html+=`<input type="number" placeholder="${unitTypes[type].labels[u]}" id="unit_${u}" onchange="convertUnits()">`;});}
    html+='</div></div>'; container.innerHTML=html;
}

function convertUnits(){
    const typeEl=document.getElementById('unitType'); if(!typeEl) return; const type=typeEl.value;
    if(type==='temperature'){
        const units=['C','F','K']; let value,fromUnit; for(let u of units){const inp=document.getElementById('unit_'+u); if(inp && inp.value){value=parseFloat(inp.value); fromUnit=u; break;}} if(!value && value!==0) return; units.forEach(u=>{ if(u!==fromUnit){ const inp=document.getElementById('unit_'+u); if(inp) inp.value=unitTypes.temperature.convert(value,fromUnit,u).toFixed(2); }});
    } else {
        const units=Object.keys(unitTypes[type].units); let value,fromUnit; for(let u of units){const inp=document.getElementById('unit_'+u); if(inp && inp.value){value=parseFloat(inp.value); fromUnit=u; break;}} if(!value && value!==0) return; const baseValue=value/unitTypes[type].units[fromUnit]; units.forEach(u=>{ if(u!==fromUnit){ const inp=document.getElementById('unit_'+u); if(inp) inp.value=(baseValue*unitTypes[type].units[u]).toFixed(6); }});
    }
}

function encodeBase64(){ const el=document.getElementById('textToEncode'); if(!el) return; const text=el.value; try{ const out=document.getElementById('encodedOutput'); if(out) out.textContent=btoa(unescape(encodeURIComponent(text))); }catch(e){const out=document.getElementById('encodedOutput'); if(out) out.textContent='Fehler!'; } }
function decodeBase64(){ const el=document.getElementById('textToDecode'); if(!el) return; const text=el.value; try{ const out=document.getElementById('decodedOutput'); if(out) out.textContent=decodeURIComponent(escape(atob(text))); }catch(e){const out=document.getElementById('decodedOutput'); if(out) out.textContent='Fehler!'; } }

function formatJSON(){ const input=document.getElementById('jsonInput'); if(!input) return; try{ const formatted=JSON.stringify(JSON.parse(input.value), null, 2); const out=document.getElementById('jsonOutput'); if(out) out.textContent=formatted; showStatus('✓ JSON ist gültig','success'); }catch(e){ showStatus('✗ Fehler: '+e.message,'error'); } }
function validateJSON(){ const input=document.getElementById('jsonInput'); if(!input) return; try{ JSON.parse(input.value); showStatus('✓ JSON ist gültig','success'); }catch(e){ showStatus('✗ Fehler: '+e.message,'error'); } }
function minifyJSON(){ const input=document.getElementById('jsonInput'); if(!input) return; try{ const out=document.getElementById('jsonOutput'); if(out) out.textContent=JSON.stringify(JSON.parse(input.value)); showStatus('✓ JSON minimiert','success'); }catch(e){ showStatus('✗ Fehler: '+e.message,'error'); } }
function showStatus(msg,type){ const el=document.getElementById('jsonStatus'); if(!el) return; el.textContent=msg; el.className='status-message '+type; }

function encodeURL(){ const el=document.getElementById('urlToEncode'); if(!el) return; const out=document.getElementById('encodedURL'); if(out) out.textContent=encodeURIComponent(el.value); }
function decodeURL(){ const el=document.getElementById('urlToDecode'); if(!el) return; try{ const out=document.getElementById('decodedURL'); if(out) out.textContent=decodeURIComponent(el.value); }catch(e){ const out=document.getElementById('decodedURL'); if(out) out.textContent='Fehler!'; } }

function unixToDate(){ const el=document.getElementById('unixTimestamp'); if(!el) return; const ts=parseInt(el.value); if(!isNaN(ts)){ const out=document.getElementById('dateOutput'); if(out) out.textContent=new Date(ts*1000).toLocaleString('de-DE'); } }
function dateToUnix(){ const el=document.getElementById('dateInput'); if(!el) return; const date=el.value; if(date){ const out=document.getElementById('unixOutput'); if(out) out.textContent=Math.floor(new Date(date).getTime()/1000); } }
function currentUnix(){ const ts=Math.floor(Date.now()/1000); const out=document.getElementById('unixOutput'); if(out) out.textContent=ts; const out2=document.getElementById('dateOutput'); if(out2) out2.textContent=new Date(ts*1000).toLocaleString('de-DE'); }

function convertFromDecimal(){ const el=document.getElementById('decimalInput'); if(!el) return; const dec=parseInt(el.value); if(!isNaN(dec)){ const b=document.getElementById('binaryConv'); if(b) b.textContent=dec.toString(2); const h=document.getElementById('hexConv'); if(h) h.textContent=dec.toString(16).toUpperCase(); const o=document.getElementById('octalConv'); if(o) o.textContent=dec.toString(8); } }

function convertFilesize(){ const vEl=document.getElementById('filesizeValue'); const uEl=document.getElementById('filesizeUnit'); if(!vEl||!uEl) return; const value=parseFloat(vEl.value); const unit=uEl.value; if(isNaN(value)||value<0) return; const units={'B':1,'KB':1024,'MB':1024**2,'GB':1024**3,'TB':1024**4,'PB':1024**5}; const bytes=value*units[unit]; let html=''; for(const [key,factor] of Object.entries(units)){ html+=`<div style="padding:10px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);border-radius:6px;margin-bottom:8px"><strong>${key}:</strong> ${(bytes/factor).toFixed(4)}</div>`; } const out=document.getElementById('filesizeResults'); if(out) out.innerHTML=html; }
