# 🔥 Meme HUB Generator

<div align="center">
  <img src="https://github.com/AllxdDev-Hosting/store_db/blob/main/memegen.png?raw=true" alt="Meme Generator Preview" width="100%">
</div>

## 📱 Apaan Nih?

Sup gaes! Ini tuh project meme generator yang bisa bikin meme kekinian pake template yang udah disediain. Dijamin bikin konten lo makin yahud! 

## 🚀 Fitur-Fitur Keren

- ⚡ Bikin meme cuma 10 detik doang
- 🎨 Ada 2 template kece (phub & xnxx style)
- 📸 Upload gambar sendiri bisa banget
- 💫 UI/UX nya clean bet dah
- 🔒 Anti spam & secure abis
- 📱 Responsive di hape, tablet, sama laptop

## 🛠️ Cara Install Local

Lu butuh install ini dulu ya gaes:
```bash
- Node.js v20.10.0 ke atas
- NPM v10.0.0 ke atas
```

Trus tinggal:

1. Clone repo ini ke komputer lu
```bash
git clone https://github.com/AllxdDev-Hosting/meme-generator.git
```

2. Masuk ke folder projectnya
```bash
cd meme-generator
```

3. Install semua yang dibutuhin
```bash
npm install
```

4. Jalanin projectnya
```bash
npm run dev
```

5. Buka browser lu, trus ketik
```
http://localhost:3000
```

## 🚂 Deploy ke Railway

Kalo mau deploy ke Railway, ikutin step ini gaes:

1. **Fork Repository Ini**
   - Fork repo ini ke GitHub lu

2. **Setup di Railway**
   - Bikin project baru di Railway
   - Connect sama GitHub repository yang udah lu fork
   - Set environment variables yang dibutuhin:
   ```
   NODE_ENV=production
   SESSION_SECRET=<random-string-minimal-24-karakter>
   RATE_LIMIT_MAX=10
   ```

3. **Pastiin File Template Ada**
   - Bikin folder `template/` di root project
   - Masukin file `phub.png` dan `xnxx.png` ke folder itu

4. **Struktur File yang Harus Ada**
   ```
   ├── Dockerfile
   ├── Procfile
   ├── package.json
   ├── server.js
   ├── views/
   │   └── index.ejs
   ├── template/
   │   ├── phub.png
   │   └── xnxx.png
   └── public/
       └── output/
   ```

## 🎯 Cara Pake

1. Pilih template yang lu mau (phub apa xnxx)
2. Upload gambar yang pengen lu jadiin meme
3. Isi judul sama subtitle sesuai template
4. Klik "Generate Meme"
5. Tunggu 10 detik (anti spam bro!)
6. Download meme lu yang udah jadi

## 🔧 Tech Stack

- Node.js & Express.js buat backend
- EJS buat view engine
- Bootstrap 5 buat UI yang kece
- Canvas buat edit gambar
- Docker buat deployment
- Rate limiting buat anti spam

## 🤝 Mau Kontribusi?

Gas dong! Kita open source nih. Lu bisa:

1. Fork repo ini
2. Bikin branch baru: `git checkout -b fitur-keren`
3. Commit perubahan lu: `git commit -m 'Nambahin fitur keren'`
4. Push ke branch lu: `git push origin fitur-keren`
5. Bikin Pull Request

## 📝 Catetan Penting

- Rate limit: 10 request/jam per IP
- Cooldown: 30 detik per generate
- Max file size: 5MB
- Format yang didukung: jpg, jpeg, png, gif
- File bakal dihapus otomatis setelah 30 menit
- Session timeout: 24 jam

## 🔗 Link Penting

- [Website Demo](https://myhome-allxddev.vercel.app/)
- [E-KTP Generator](https://e-ktp-generator-production.up.railway.app)
- [GitHub](https://github.com/AllxdDev-Hosting)
- [WhatsApp Channel](https://whatsapp.com/channel/0029VaeDz5s7tkjFotHFwP0l)

## 👨‍💻 Author

Project ini dibuat dengan ❤️ sama:
- [AllxdDev](https://myhome-allxddev.vercel.app/)
- [AllxdDev-Hosting](https://github.com/AllxdDev-Hosting)

---

<div align="center">
  <b>Kalo lu suka project ini, jangan lupa kasih ⭐ ya gaes!</b>
</div> 