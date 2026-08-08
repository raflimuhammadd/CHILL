-- ============================================================
-- SEED DATA: contents, episodes, content_genres, content_recommendations
-- Generated from client/src/data/filmData.js
-- Requires: genres already seeded (15 rows, ids 1-15) per chill-streams-schema.sql
-- ============================================================

INSERT INTO contents (content_type, title, slug, description, release_year, age_rating, total_episodes, duration_minutes, youtube_id, poster_url, banner_url, cast, creator, rating, is_premium_only) VALUES
  ('series', 'Ted Lasso', 'ted-lasso', 'Seorang pelatih sepak bola Amerika yang optimis dipekerjakan untuk melatih tim sepak bola profesional Inggris, meskipun ia tidak memiliki pengalaman melatih sepak bola.', 2020, '13+', 12, NULL, '3u7EIiohs6U', '/assets/images/ted-lasso-potrait.png', '/assets/images/ted-lands.png', 'Jason Sudeikis, Hannah Waddingham, Brett Goldstein, Juno Temple, Brendan Hunt, Nick Mohammed', 'Bill Lawrence, Jason Sudeikis, Brendan Hunt, Joe Kelly', 4.7, 0),
  ('movie', 'Guardians of the Galaxy', 'guardian-galaxy', 'Peter Quill alias Star-Lord, seorang pencuri asal bumi, mencuri sebuah bola misterius dan menjadi buronan setelah dikejar penjahat super Ronan. Ia terpaksa beraliansi dengan empat orang buangan luar angkasa untuk menyelamatkan galaksi.', 2014, '13+', NULL, 122, 'd96cjJhvlMA', '/assets/images/guardian.png', '/assets/images/guardian-lands.png', 'Chris Pratt, Zoe Saldana, Dave Bautista, Vin Diesel, Bradley Cooper', 'James Gunn', 4.6, 0),
  ('series', 'Duty After School', 'duty-after-school', 'Sebuah benda tak dikenal mengambil alih dunia. Dalam keputusasaan, Departemen Pertahanan mulai merekrut lebih banyak tentara, termasuk siswa sekolah menengah. Mereka pun segera menjadi pejuang garis depan dalam perang.', 2023, '18+', 10, NULL, 'U0MOoyI7pIM', '/assets/images/duty-after-potrait.png', '/assets/images/duty-after.png', 'Shin Hyun-soo, Lee Soon-won, Im Se-mi, Kim Ki-hae, Kwon Eun-bin, Moon Sang-min', 'Lee Nam-kyu', 4.5, 0),
  ('series', 'Alice in Borderland', 'alice-in-borderland', 'Seorang gamer dan dua temannya menemukan diri mereka di Tokyo yang sepi dan dipaksa untuk bersaing dalam serangkaian permainan mematikan untuk bertahan hidup di dunia paralel.', 2020, '18+', 8, NULL, '49_44FFKZ1M', '/assets/images/alice.png', '/assets/images/alice-lands.png', 'Kento Yamazaki, Tao Tsuchiya, Nijiro Murakami, Yuki Morinaga, Keita Machida, Ayaka Miyoshi', 'Shinsuke Sato', 4.5, 0),
  ('series', 'All of Us Are Dead', 'all-of-us-dead', 'Siswa sekolah menengah terjebak di sekolah mereka saat virus zombie menyebar dengan cepat. Mereka harus berjuang untuk bertahan hidup atau berubah menjadi salah satu dari mereka.', 2022, '17+', 12, NULL, 'IN5TD4VRcSM', '/assets/images/all-off-us.png', '/assets/images/all-of-us-lands.png', 'Park Ji-hu, Yoon Chan-young, Cho Yi-hyun, Lomon, Yoo In-soo, Lee Yoo-mi', 'Chun Sung-il, Lee Jae-kyoo', 4.5, 0),
  ('movie', 'Avatar', 'avatar', 'Jake Sully dan Neytiri bersama anak-anak mereka yang hidup damai di Pandora. Ancaman datang ketika kolonial manusia RDA kembali. Untuk melindungi keluarga dan sukunya, Jake dan keluarganya melarikan diri dan berlindung pada suku laut Metkayina', 2009, '13+', NULL, 161, 'M8Mi0elohJw', '/assets/images/avatar.png', '/assets/images/avatar.png', 'Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang, Michelle Rodriguez', 'James Cameron', 4.5, 0),
  ('movie', 'Avatar: The Way of Water', 'avatar-way-of-water', 'Jake Sully dan Neytiri bersama anak-anak mereka hidup damai di Pandora. Ancaman datang ketika kolonial manusia RDA kembali. Untuk melindungi keluarga dan sukunya, mereka melarikan diri dan berlindung pada suku laut Metkayina.', 2022, '13+', NULL, 192, 'ysxvVoP7-dU', '/assets/images/avatar-2.png', '/assets/images/avatar-lands.png', 'Sam Worthington, Zoe Saldana, Sigourney Weaver, Kate Winslet', 'James Cameron', 4.5, 1),
  ('movie', 'The Batman', 'the-batman', 'Ketika seorang pembunuh berantai yang sadis mulai membunuh tokoh-tokoh penting di Gotham, Batman harus menyelidiki pesan-pesan misterius yang ditinggalkan oleh si pembunuh sambil mengungkap jaringan korupsi yang lebih dalam di kota itu.', 2022, '13+', NULL, 175, '0h8ZBXUNXXM', '/assets/images/batman.png', '/assets/images/batman-lands.png', 'Robert Pattinson, Zoë Kravitz, Paul Dano, Colin Farrell, Jeffrey Wright', 'Matt Reeves', 4.5, 0),
  ('series', 'Baymax!', 'baymax', 'Baymax, robot perawat kesehatan yang menggemaskan, kembali membantu orang-orang di San Fransokyo dengan cara uniknya yang penuh kehangatan.', 2022, '7+', 6, NULL, 'lcYPrMk12zw', '/assets/images/baymax.png', '/assets/images/baymax-lands.png', 'Scott Adsit, Ryan Potter, Maya Rudolph, Emily Kuroda, Lilimar, Jaboukie Young-White', 'Don Hall', 4.5, 0),
  ('movie', 'Big Hero 6', 'big-hero-6', 'Hiro Hamada, seorang jenius robotika muda, membentuk tim pahlawan super bersama robot kesehatan bernama Baymax dan teman-temannya untuk menghadapi penjahat misterius yang mengancam kota San Fransokyo.', 2014, '7+', NULL, 102, '8IdMPpKMdcc', '/assets/images/big-6.png', '/assets/images/big-6-lands.png', 'Ryan Potter, Scott Adsit, Jamie Chung, Daman Wayans Jr., T.J. Miller', 'Don Hall, Chris Williams', 4.5, 1),
  ('movie', 'Black Adam', 'black-adam', 'Black Adam, seorang anti-pahlawan legendaris yang dibangkitkan dari masa lalu, diberikan kekuatan oleh para dewa. Setelah hampir 5.000 tahun dikurung, ia dibebaskan dan membawa keadilan dengan caranya sendiri yang brutal di dunia modern.', 2022, '13+', NULL, 124, 'JaV7mmc9HGw', '/assets/images/black-adam.png', '/assets/images/black-adam-lands.png', 'Dwayne Johnson, Aldis Hodge, Noah Centineo, Sarah Shahi, Pierce Brosnan', 'Jaume Collet-Serra', 4.5, 0),
  ('series', 'Blue Lock', 'blue-lock', 'Sebuah program pelatihan sepak bola ekstrem yang mempertemukan 300 pemain muda terbaik Jepang untuk bersaing memperebutkan satu posisi striker terbaik di dunia. Yoichi Isagi harus beradaptasi dengan kompetisi brutal ini untuk mewujudkan mimpinya menjadi pemain sepak bola terbaik.', 2022, '13+', 24, NULL, 'QAlsuW5EXUg', '/assets/images/blue-lock.png', '/assets/images/blue-lock-lands.png', 'Kazuki Ura, Yuma Uchida, Miyu Irino, Tasuku Kaito, Soma Saito', 'Muneyuki Kaneshiro', 4.5, 0),
  ('series', 'The Devil Judge', 'devil-judge', 'Di masa depan dystopian Korea, masyarakat mendambakan keadilan dan terobsesi dengan pertunjukan realitas. Hakim misterius Kang Yo-han memimpin persidangan langsung yang disiarkan di mana rakyat menjadi juri. Seorang hakim idealis bergabung dan mulai mempertanyakan motif di balik pengadilan tersebut.', 2021, '17+', 16, NULL, 'qSstsZey9Kg', '/assets/images/devil-at-me.png', '/assets/images/devil-lands.png', 'Ji Sung, Kim Min-jung, Park Jin-young, Park Gyu-young', 'Moon Yoo-seok', 4.5, 0),
  ('movie', 'Dilan 1990', 'dilan-1990', 'Kisah cinta remaja antara Milea, seorang siswi pindahan dari Jakarta, dan Dilan, seorang siswa populer di sekolah mereka di Bandung tahun 1990. Dilan dengan segala keunikan dan keberaniannya berusaha memenangkan hati Milea.', 2018, '13+', NULL, 110, '4RowGQWWQWc', '/assets/images/dilan.png', '/assets/images/dilan-lands.png', 'Iqbaal Ramadhan, Vanesha Prescilla, Bucek Depp, Happy Salma', 'Fajar Bustomi', 4.5, 0),
  ('movie', 'Doctor Strange in the Multiverse of Madness', 'doctor-strange-multiverse', 'Dr. Stephen Strange membuka pintu ke multiverse setelah secara tidak sengaja menggunakan mantra terlarang. Ia harus bekerja sama dengan sekutu lama dan baru untuk melintasi realitas alternatif yang berbahaya dan menghadapi musuh misterius.', 2022, '13+', NULL, 126, '4rFme4ubfNk', '/assets/images/doc-strange.png', '/assets/images/doc-strange-lands.png', 'Benedict Cumberbatch, Elizabeth Olsen, Chiwetel Ejiofor, Benedict Wong, Xochitl Gomez', 'Sam Raimi', 4.5, 0),
  ('movie', 'Don''t Look Up', 'dont-look-up', 'Dua astronom menemukan sebuah komet raksasa yang akan menghancurkan Bumi dalam waktu dekat. Mereka berusaha memperingatkan dunia melalui media dan pemerintah, tetapi tidak ada yang mau mendengarkan. Satir gelap tentang respons masyarakat terhadap krisis.', 2021, '18+', NULL, 138, 'RbIxYm3mKzI', '/assets/images/dont-look.png', '/assets/images/dont-look-lands.png', 'Leonardo DiCaprio, Jennifer Lawrence, Meryl Streep, Cate Blanchett, Timothée Chalamet', 'Adam McKay', 4.5, 0),
  ('movie', 'Fast X', 'fast-x', 'Dominic Toretto dan keluarganya menjadi target balas dendam manusia paling berbahaya yang pernah mereka hadapi: Dante Reyes, yang ingin menghancurkan segalanya yang dicintai Dom. Kali ini, Dom harus melindungi keluarganya dengan cara apa pun.', 2023, '13+', NULL, 141, '32RAq6JzY-w', '/assets/images/fast-x.png', '/assets/images/fast-x-lands.png', 'Vin Diesel, Jason Momoa, Michelle Rodriguez, Tyrese Gibson, Ludacris', 'Louis Leterrier', 4.5, 0),
  ('series', 'Happiness', 'happiness', 'Mengisahkan perjuangan hidup sepasang sahabat di sebuah apartemen bertingkat yang di-lockdown akibat wabah penyakit misterius yang mengubah manusia menjadi haus darah.', 2021, '18+', 12, NULL, 'gqhUlldiLEo', '/assets/images/happiness.png', '/assets/images/happiness-lands.png', 'Han Hyo-joo, Park Hyung-sik, Jo Woo-jin', 'Ahn Gil-ho', 4.5, 0),
  ('movie', 'Jurassic World', 'jurassic-world', 'Taman hiburan Jurassic World di pulau Isla Nublar beroperasi penuh dengan dinosaurus hasil rekayasa genetik. Namun, ketika dinosaurus hibrida baru yang cerdas melarikan diri, liburan keluarga berubah menjadi perjuangan untuk bertahan hidup.', 2015, '13+', NULL, 124, 'RFinNxS5KN4', '/assets/images/jurrasic-world.png', '/assets/images/jurrasic-lands.png', 'Chris Pratt, Bryce Dallas Howard, Vincent D''Onofrio, Omar Sy, BD Wong', 'Colin Trevorrow', 4.5, 0),
  ('movie', 'The Little Mermaid', 'little-mermaid', 'Ariel, seorang putri duyung muda yang penasaran dengan dunia manusia, membuat kesepakatan dengan penyihir laut Ursula untuk menjadi manusia. Ia harus memenangkan cinta Pangeran Eric dalam tiga hari atau jiwanya akan menjadi milik Ursula.', 2023, '7+', NULL, 135, 'kepHY685b34', '/assets/images/lit-mermaid.png', '/assets/images/little-mermaid-lands.png', 'Halle Bailey, Jonah Hauer-King, Daveed Diggs, Melissa McCarthy, Javier Bardem', 'Rob Marshall', 4.5, 1),
  ('movie', 'MEGAN', 'megan', 'Seorang insinyur robotika menjadi wali bagi keponakannya yang yatim piatu. Ia menciptakan sebuah boneka AI yang disebut M3GAN untuk menemani dan melindungi gadis itu. Namun M3GAN menjadi terlalu protektif dengan cara yang mengerikan.', 2022, '13+', NULL, 102, 'jgmZLGbcCY8', '/assets/images/megan.png', '/assets/images/megan-lands.png', 'Allison Williams, Violet McGraw, Amie Donald, Jenna Davis, Ronny Chieng', 'Gerard Johnstone', 4.5, 0),
  ('movie', 'Spider-Man: Across the Spider-Verse', 'spider-verse', 'Miles Morales berpetualang melintasi multiverse untuk bergabung dengan Spider-People dari berbagai dimensi. Ia harus menghadapi ancaman baru dan menentukan arti menjadi seorang pahlawan dalam petualangan epik ini.', 2023, '7+', NULL, 140, 'cqGjhVJWtEg', '/assets/images/miles-morales.png', '/assets/images/miles-lands.png', 'Shameik Moore, Hailee Steinfeld, Oscar Isaac, Jake Johnson, Issa Rae', 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson', 4.5, 0),
  ('movie', 'Missing', 'missing', 'Seorang remaja perempuan menggunakan keterampilan internetnya untuk menyelidiki hilangnya ibunya secara misterius saat liburan di Kolombia. Tanpa bantuan orang dewasa, ia harus meretas sistem dan melintasi batas untuk mengungkap kebenaran.', 2023, '13+', NULL, 111, 'C1b-w4zBPlI', '/assets/images/missing.png', '/assets/images/missing-lands.png', 'Storm Reid, Nia Long, Ken Leung, Amy Landecker, Daniel Henney', 'Will Merrick, Nick Johnson', 4.5, 0),
  ('series', 'My Hero Academia', 'my-hero-academia', 'Di dunia di mana hampir setiap orang memiliki kekuatan super yang disebut Quirk, Izuku Midoriya adalah salah satu dari sedikit manusia tanpa kekuatan. Namun ia bercita-cita menjadi pahlawan. Takdirnya berubah saat bertemu pahlawan terhebat All Might yang mewariskan Quirk padanya. Izuku bergabung dengan SMA UA untuk menjadi pahlawan profesional.', 2016, '13+', 24, NULL, 'Sh8XzoEbpFs', '/assets/images/my-hero-aca.png', '/assets/images/my-hero-lands.png', 'Daiki Yamashita, Nobuhiko Okamoto, Kenta Miyake, Ayane Sakura, Kaito Ishikawa', 'Kohei Horikoshi', 4.5, 0),
  ('series', 'My Perfect Stranger', 'my-perfect-stranger', 'Yoon Hae-joon, seorang editor majalah, terjebak di tahun 1987 setelah mengendarai mobil misterius. Di sana ia bertemu Baek Yoon-young, seorang mahasiswi yang berusaha menyelidiki kasus pembunuhan berantai. Keduanya bekerja sama untuk mengubah masa depan sambil menemukan misteri yang menghubungkan mereka.', 2023, '13+', 16, NULL, 'uKs-xeZ1xQ0', '/assets/images/my-perfect.png', '/assets/images/my-perfect-lands.png', 'Kim Dong-wook, Jin Ki-joo, Seo Ji-hoon, Lee Won-jung', 'Kang Soo-yeon', 4.5, 0),
  ('movie', 'A Man Called Otto', 'man-called-otto', 'Otto adalah seorang duda tua pemarah yang pensiun dan tinggal sendiri. Hidupnya berubah ketika sebuah keluarga muda pindah ke sebelah rumahnya. Dengan bantuan mereka, Otto belajar kembali arti kehidupan dan kebahagiaan.', 2022, '13+', NULL, 126, 'eFYUX9l-m5I', '/assets/images/otto.png', '/assets/images/otto-lands.png', 'Tom Hanks, Mariana Treviño, Rachel Keller, Manuel Garcia-Rulfo', 'Marc Forster', 4.5, 1),
  ('movie', 'Ant-Man and the Wasp: Quantumania', 'ant-man-quantumania', 'Scott Lang dan Hope van Dyne bersama orang tua Hope, Hank Pym dan Janet van Dyne, tersedot ke dunia kuantum yang misterius. Mereka harus bekerja sama untuk melawan Kang sang Penakluk dan menemukan jalan pulang ke dunia nyata.', 2023, '13+', NULL, 125, 'VfpWhTgAt7A', '/assets/images/ant-quantum.png', '/assets/images/quantum-lands.png', 'Paul Rudd, Evangeline Lilly, Jonathan Majors, Michael Douglas, Michelle Pfeiffer', 'Peyton Reed', 4.5, 1),
  ('movie', 'Rio', 'rio', 'Blu, seekor macaw biru jinak yang tidak bisa terbang, dibawa dari Minnesota ke Rio de Janeiro untuk bertemu dengan Pearl, satu-satunya macaw biru betina yang tersisa. Petualangan dimulai saat mereka diculik oleh penyelundup burung.', 2011, '7+', NULL, 96, 'P1GRO31ve5Q', '/assets/images/rio.png', '/assets/images/rio-lands.png', 'Jesse Eisenberg, Anne Hathaway, Jemaine Clement, Leslie Mann, will.i.am', 'Carlos Saldanha', 4.5, 0),
  ('movie', 'Shazam! Fury of the Gods', 'shazam-fury', 'Billy Batson dan teman-teman supernya masih belajar menggunakan kekuatan dewa mereka. Namun ketika para dewa mitologi kuno mengancam Bumi, Shazam dan keluarganya harus bersatu untuk melindungi dunia dan kekuatan mereka.', 2023, '13+', NULL, 130, 'Zi88i4CpHe4', '/assets/images/shazam.png', '/assets/images/shazam-lands.png', 'Zachary Levi, Asher Angel, Jack Dylan Grazer, Rachel Zegler, Helen Mirren', 'David F. Sandberg', 4.5, 0),
  ('movie', 'Sonic the Hedgehog 2', 'sonic-2', 'Sonic si landak biru kembali bersama sahabatnya Tom. Kali ini ia harus menghadapi Dr. Robotnik yang kembali dengan sekutu baru, Knuckles. Sonic bergabung dengan Tails untuk menyelamatkan dunia dari ancaman baru.', 2022, '7+', NULL, 122, 'aABuE-1Lg4c', '/assets/images/sonic-2.png', '/assets/images/sonic-2-lands.png', 'James Marsden, Ben Schwartz, Idris Elba, Colleen O''Shaughnessey, Jim Carrey', 'Jeff Fowler', 4.5, 0),
  ('movie', 'Stuart Little', 'stuart-little', 'Keluarga Little mengadopsi seorang anak laki-laki bernama Stuart — yang kebetulan adalah seekor tikus kecil yang bisa berbicara. Stuart harus beradaptasi dengan kehidupan barunya bersama keluarga manusia dan menghadapi kucing keluarga yang tidak menyukainya.', 1999, '7+', NULL, 84, 'AzXv1fPo9J4', '/assets/images/stuart-little.png', '/assets/images/stuart-lands.png', 'Michael J. Fox, Geena Davis, Hugh Laurie, Jonathan Lipnicki, Nathan Lane', 'Rob Minkoff', 4.5, 1),
  ('movie', 'The Tomorrow War', 'tomorrow-war', 'Sekelompok tentara dari masa depan melakukan perjalanan waktu ke masa kini untuk merekrut warga sipil bergabung dalam perang melawan alien yang mengancam keberadaan umat manusia. Seorang guru sains direkrut dan harus meninggalkan keluarganya.', 2021, '13+', NULL, 140, 'P42u4IE-Qng', '/assets/images/tomorrow-war.png', '/assets/images/tomorrow-war-lands.png', 'Chris Pratt, Yvonne Strahovski, J.K. Simmons, Betty Gilpin, Sam Richardson', 'Chris McKay', 4.5, 0),
  ('movie', 'Suzume', 'suzume', 'Suzume, seorang gadis SMA, bertemu seorang pemuda yang mencari pintu misterius. Ia mengikuti pemuda itu dan secara tidak sengaja membuka pintu yang melepaskan bencana ke Jepang. Suzume harus berlari melintasi Jepang untuk menutup pintu-pintu itu.', 2023, '7+', NULL, 122, 'KlnIuIVftaU', '/assets/images/suzume.png', '/assets/images/suzume-lands.png', 'Nanoka Hara, Hokuto Matsumura, Eri Fukatsu, Sōta Fukushi', 'Makoto Shinkai', 4.5, 0),
  ('series', 'Light Shop', 'light-shop', 'Kisah sekelompok orang asing yang memiliki pengalaman buruk dari masa lalu mereka. Mereka tertarik ke toko lampu misterius di ujung gang gelap.', 2024, '17+', 8, NULL, 'jSj4SOdLA3A', '/assets/images/light-shop-portrait.jpg', '/assets/images/light-shop-land.jpg', 'Ju Ji-hoon, Park Bo-young, Bae Seong-woo, Uhm Tae-goo, Lee Jung-eun, Kim Min-ha', 'Kang Full', 4.5, 0),
  ('series', 'Teach You A Lesson', 'teach-you', 'Inspektur Na Hwa-jin dari Biro Perlindungan Hak Pendidikan menggunakan metode tidak konvensional untuk mendisiplinkan siswa nakal dan mereformasi sistem pendidikan.', 2026, '17+', 10, NULL, 'TT_EtQFAVIM', '/assets/images/teach-you-portrait.jpg', '/assets/images/teach-you-land.jpg', 'Kim Mu-yeol, Lee Sung-min, Jin Ki-joo, Pyo Ji-hoon', 'Lee Nam-kyu', 4.9, 0),
  ('series', 'Crash Landing On You', 'crash-land', 'Seorang pewaris kaya Korea Selatan mengalami kecelakaan paralayang dan mendarat darurat di Korea Utara, di mana ia bertemu seorang perwira tentara yang memutuskan untuk melindunginya.', 2019, '21+', 16, NULL, 'eXMjTXL2Vks', '/assets/images/crash-landing-portrait.jpg', '/assets/images/crash-landing-land.jpg', 'Hyun Bin, Son Ye-jin, Seo Ji-hye, Kim Jung-hyun', 'Park Ji-eun', 4.9, 1),
  ('movie', 'Avengers Doom''s Day', 'doomsday', 'Para Avengers bersatu kembali untuk menghadapi ancaman terbesar mereka: Doctor Doom yang telah mendapatkan kekuatan tak terbayangkan. Pertempuran epik ini akan menentukan nasib Bumi dan multiverse.', 2026, '13+', NULL, 122, 'irVNGjRFZGk', '/assets/images/avengers-dooms-prtrt.jpeg', '/assets/images/avengers-dooms-lands.jpg', 'Robert Downey Jr., Chris Evans, Scarlett Johansson, Benedict Cumberbatch', 'Anthony Russo, Joe Russo', 4.8, 1),
  ('movie', 'The Amazing Spider-Man', 'amazing-spidey', 'Peter Parker, seorang remaja SMA yang cerdas, mendapatkan kekuatan seperti laba-laba setelah digigit laba-laba hasil rekayasa genetika. Ia belajar bahwa dengan kekuatan besar datang tanggung jawab besar, saat ia berhadapan dengan The Lizard.', 2012, '13+', NULL, 122, 'cjq5-zmIpWA', '/assets/images/amazing-spidey-prtrt.jpg', '/assets/images/amazing-spidey-lands.jpg', 'Andrew Garfield, Emma Stone, Rhys Ifans, Denis Leary, Sally Field', 'Marc Webb', 4.6, 1),
  ('movie', 'Spiderman Brand New Day', 'spidey-brand-new-day', 'Peter Parker kembali dengan identitas baru setelah rahasianya terbongkar. Dengan bantuan teman-teman lamanya, ia berjuang melawan musuh baru yang lebih kuat dari sebelumnya dalam petualangan Spider-Man yang belum pernah ada.', 2026, '13+', NULL, 122, 'pB2Y8Yr8j5A', '/assets/images/spiderman-brand-new-day-prtrt.jpeg', '/assets/images/spiderman-brand-new-day-lands.jpeg', 'Tom Holland, Zendaya, Benedict Cumberbatch, Jacob Batalon', 'Destin Daniel Cretton', 4.6, 1);

INSERT INTO episodes (content_id, episode_number, title, description, duration_minutes, youtube_id, thumbnail_url)
SELECT c.id, v.episode_number, v.title, v.description, v.duration_minutes, v.youtube_id, v.thumbnail_url
FROM (
  SELECT 'ted-lasso' AS content_slug, 1 AS episode_number, 'Pilot' AS title, 'American football coach Ted Lasso is hired by a wealthy divorcée to coach the English soccer team AFC Richmond.' AS description, 31 AS duration_minutes, '3u7EIiohs6U' AS youtube_id, '/assets/images/ted-lasso-trailer-1.png' AS thumbnail_url
  UNION ALL SELECT 'ted-lasso', 2, 'Biscuits', 'It''s Ted''s first day of coaching, and fans aren''t happy. He makes little headway but remains undeterred as the team play their first match.', 29, '3u7EIiohs6U', '/assets/images/ted-lasso-trailer-2.png'
  UNION ALL SELECT 'ted-lasso', 3, 'Trent Crimm: The Independent', 'To arrange an in-depth exposé, Rebecca pairs cynical journalist Trent Crimm with Ted for a day.', 30, '3u7EIiohs6U', '/assets/images/ted-lasso-trailer-3.png'
  UNION ALL SELECT 'ted-lasso', 4, 'For the Children', 'Rebecca hosts the team''s annual charity benefit, where Ted stages a reconciliation between Roy and Jamie.', 34, '3u7EIiohs6U', '/assets/images/ted-lasso-trailer-4.png'
  UNION ALL SELECT 'ted-lasso', 5, 'Tan Lines', 'With his wife and son visiting from America, Ted makes drastic changes to the lineup during a critical match.', 31, '3u7EIiohs6U', '/assets/images/ted-lasso-trailer-5.png'
  UNION ALL SELECT 'duty-after-school', 1, 'Episode 1', 'Inspector Na Hwa-jin steps into the chaos and takes control of a school plagued by mysterious spheres.', 55, 'U0MOoyI7pIM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'duty-after-school', 2, 'Episode 2', 'Students are recruited into military training as the alien threat intensifies.', 60, 'U0MOoyI7pIM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'duty-after-school', 3, 'Episode 3', 'The group faces their first real combat situation against the spheres.', 58, 'U0MOoyI7pIM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'duty-after-school', 4, 'Episode 4', 'Tensions rise within the group as survival becomes increasingly difficult.', 62, 'U0MOoyI7pIM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'duty-after-school', 5, 'Episode 5', 'A devastating loss forces the students to question their mission.', 65, 'U0MOoyI7pIM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'alice-in-borderland', 1, 'Episode 1', 'Arisu and his friends find themselves in a deserted Tokyo and are forced to compete in dangerous games.', 48, '49_44FFKZ1M', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'alice-in-borderland', 2, 'Episode 2', 'The group encounters other players and learns more about the deadly game world.', 56, '49_44FFKZ1M', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'alice-in-borderland', 3, 'Episode 3', 'Arisu meets Usagi and they team up to survive the increasingly difficult games.', 50, '49_44FFKZ1M', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'alice-in-borderland', 4, 'Episode 4', 'The group discovers The Beach, a safe haven where players gather.', 52, '49_44FFKZ1M', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'alice-in-borderland', 5, 'Episode 5', 'Dark secrets about The Beach begin to surface as tensions escalate.', 45, '49_44FFKZ1M', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'all-of-us-dead', 1, 'Episode 1', 'A high school becomes ground zero for a zombie virus outbreak.', 66, 'IN5TD4VRcSM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'all-of-us-dead', 2, 'Episode 2', 'The infected multiply in droves as the students run for their lives.', 68, 'IN5TD4VRcSM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'all-of-us-dead', 3, 'Episode 3', 'The group seeks shelter in the music room while Nam-ra discovers something unsettling.', 57, 'IN5TD4VRcSM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'all-of-us-dead', 4, 'Episode 4', 'The students make a risky escape attempt across the rooftops.', 65, 'IN5TD4VRcSM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'all-of-us-dead', 5, 'Episode 5', 'Na-yeon''s betrayal puts everyone at risk as tensions reach a breaking point.', 53, 'IN5TD4VRcSM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'baymax', 1, 'Cass', 'Aunt Cass sprains her ankle and Baymax tries to help run the Lucky Cat Café.', 11, 'lcYPrMk12zw', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'baymax', 2, 'Kiko', 'Baymax meets Kiko, an elderly woman who refuses his help.', 10, 'lcYPrMk12zw', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'baymax', 3, 'Sofia', 'A middle school student learns about menstruation with Baymax''s help.', 10, 'lcYPrMk12zw', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'baymax', 4, 'Mbita', 'Baymax helps a young man deal with a severe fish allergy.', 11, 'lcYPrMk12zw', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'baymax', 5, 'Yuki', 'A man learns to accept help after Baymax intervenes in his daily routine.', 10, 'lcYPrMk12zw', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'blue-lock', 1, 'Dream', 'Yoichi Isagi bergabung dengan proyek Blue Lock dan langsung merasakan betapa kejamnya kompetisi striker terbaik Jepang.', 24, 'QAlsuW5EXUg', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'blue-lock', 2, 'Monster', 'Persaingan di Blue Lock semakin memanas saat para pemain harus mencetak gol untuk bertahan.', 24, 'QAlsuW5EXUg', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'blue-lock', 3, 'Devour', 'Isagi belajar dari pemain terbaik dan mulai mengembangkan gaya bermainnya sendiri.', 24, 'QAlsuW5EXUg', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'blue-lock', 4, 'Luck', 'Babak kedua dimulai dengan aturan baru yang lebih kejam. Hanya yang terkuat yang akan bertahan.', 24, 'QAlsuW5EXUg', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'blue-lock', 5, 'Flow', 'Para pemain memasuki kondisi flow dan menunjukkan kemampuan terbaik mereka di lapangan.', 24, 'QAlsuW5EXUg', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'devil-judge', 1, 'The Trial Begins', 'Kang Yo-han memulai persidangan pertamanya yang menghebohkan publik Korea.', 70, 'qSstsZey9Kg', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'devil-judge', 2, 'The Idealist', 'Kim Ga-on bergabung dengan pengadilan nasional dan mulai meragukan metode Kang Yo-han.', 68, 'qSstsZey9Kg', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'devil-judge', 3, 'The Puppet', 'Konspirasi di balik layar mulai terungkap saat kekuatan politik mencoba mengendalikan pengadilan.', 72, 'qSstsZey9Kg', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'devil-judge', 4, 'The Truth', 'Masa lalu Kang Yo-han mulai terungkap dan mengungkap motif sebenarnya.', 66, 'qSstsZey9Kg', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'devil-judge', 5, 'The Verdict', 'Persidangan mencapai klimaks saat semua pihak harus menghadapi kebenaran yang paling pahit.', 75, 'qSstsZey9Kg', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'happiness', 1, 'The Outbreak', 'Wabah misterius menyebar di apartemen mewah dan para penghuni mulai menunjukkan gejala aneh.', 65, 'gqhUlldiLEo', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'happiness', 2, 'Lockdown', 'Apartemen di-lockdown dan Sae-bom serta Yi-hyun harus bertahan hidup di tengah kekacauan.', 68, 'gqhUlldiLEo', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'happiness', 3, 'The Infected', 'Semakin banyak penghuni apartemen yang terinfeksi dan situasi semakin tidak terkendali.', 70, 'gqhUlldiLEo', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'happiness', 4, 'Survival', 'Persediaan makanan mulai menipis dan kelompok yang selamat harus membuat keputusan sulit.', 66, 'gqhUlldiLEo', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'happiness', 5, 'The Truth', 'Sae-bom dan Yi-hyun menemukan kebenaran di balik wabah yang menghancurkan apartemen mereka.', 72, 'gqhUlldiLEo', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'my-hero-academia', 1, 'Izuku Midoriya: Origin', 'Izuku Midoriya, seorang anak tanpa Quirk, bertemu dengan pahlawan nomor satu All Might.', 24, 'Sh8XzoEbpFs', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'my-hero-academia', 2, 'What It Takes to Be a Hero', 'All Might memberikan izuku Quirk One for All dan mempersiapkannya untuk ujian masuk SMA UA.', 24, 'Sh8XzoEbpFs', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'my-hero-academia', 3, 'Roaring Muscles', 'Ujian masuk SMA UA dimulai dan Izuku harus menunjukkan kemampuan barunya.', 24, 'Sh8XzoEbpFs', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'my-hero-academia', 4, 'Start Line', 'Hari pertama Izuku di SMA UA dimulai dengan teman-teman dan rival baru.', 24, 'Sh8XzoEbpFs', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'my-hero-academia', 5, 'What I Can Do Now', 'Kelas 1-A menjalani pelatihan pertama mereka dengan guru mereka, Shota Aizawa.', 24, 'Sh8XzoEbpFs', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'my-perfect-stranger', 1, 'The Time Slip', 'Hae-joon secara tidak sengaja melakukan perjalanan waktu ke tahun 1987 dan bertemu dengan Yoon-young.', 65, 'uKs-xeZ1xQ0', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'my-perfect-stranger', 2, 'The Murder Case', 'Yoon-young mengajak Hae-joon untuk menyelidiki kasus pembunuhan berantai yang terjadi di desanya.', 68, 'uKs-xeZ1xQ0', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'my-perfect-stranger', 3, 'The Connection', 'Keduanya menemukan bahwa kasus pembunuhan tersebut terhubung dengan orang-orang di sekitar mereka.', 70, 'uKs-xeZ1xQ0', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'my-perfect-stranger', 4, 'The Warning', 'Hae-joon menyadari bahwa tindakannya di masa lalu bisa mengubah masa depan secara drastis.', 66, 'uKs-xeZ1xQ0', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'my-perfect-stranger', 5, 'The Race', 'Waktu terus berjalan dan mereka harus menemukan pelaku sebelum terlambat.', 72, 'uKs-xeZ1xQ0', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'light-shop', 1, 'Episode 1', 'Eight strangers find themselves inexplicably drawn to a mysterious lamp shop.', 70, 'jSj4SOdLA3A', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'light-shop', 2, 'Episode 2', 'The shopkeeper reveals the true purpose of the lamps to the bewildered strangers.', 68, 'jSj4SOdLA3A', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'light-shop', 3, 'Episode 3', 'Each person begins to confront their past trauma through the lamps.', 65, 'jSj4SOdLA3A', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'light-shop', 4, 'Episode 4', 'Secrets unravel as the group learns more about the shop''s mysterious origins.', 72, 'jSj4SOdLA3A', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'light-shop', 5, 'Episode 5', 'The boundaries between reality and fantasy begin to blur dangerously.', 60, 'jSj4SOdLA3A', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'teach-you', 1, 'Episode 1', 'Inspector Na Hwa-jin steps into the chaos and takes control of a school plagued by the spoiled son of a powerful politician.', 52, 'TT_EtQFAVIM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'teach-you', 2, 'Episode 2', 'With unassuming Bong Geun-dae on his side, Hwa-jin uses his special ops skills to handle a school gang.', 57, 'TT_EtQFAVIM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'teach-you', 3, 'Episode 3', 'When a teen influencer spreads false claims about her teachers, Inspector Im Han-rim steps in.', 72, 'TT_EtQFAVIM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'teach-you', 4, 'Episode 4', 'Hwa-jin''s team visits an elite school to uncover why a student attacked a respected teacher.', 68, 'TT_EtQFAVIM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'teach-you', 5, 'Episode 5', 'When an elementary school teacher''s spirit wears down under pressure, Hwa-jin steps in as her substitute.', 66, 'TT_EtQFAVIM', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'crash-land', 1, 'Episode 1', 'Yoon Se-ri crash-lands in North Korea after a paragliding accident and meets Ri Jeong-hyeok.', 85, 'eXMjTXL2Vks', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'crash-land', 2, 'Episode 2', 'Jeong-hyeok hides Se-ri while searching for a way to get her home safely.', 78, 'eXMjTXL2Vks', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'crash-land', 3, 'Episode 3', 'Se-ri begins to adapt to life in North Korea under Jeong-hyeok''s protection.', 82, 'eXMjTXL2Vks', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'crash-land', 4, 'Episode 4', 'A growing bond forms between Se-ri and Jeong-hyeok as danger closes in.', 84, 'eXMjTXL2Vks', '/assets/images/placeholder-episode.jpg'
  UNION ALL SELECT 'crash-land', 5, 'Episode 5', 'Political tensions and personal secrets threaten Se-ri''s safety.', 81, 'eXMjTXL2Vks', '/assets/images/placeholder-episode.jpg'
) AS v
JOIN contents c ON c.slug = v.content_slug;

INSERT INTO content_genres (content_id, genre_id)
SELECT c.id, v.genre_id
FROM (
  SELECT 'ted-lasso' AS content_slug, 3 AS genre_id
  UNION ALL SELECT 'ted-lasso', 2
  UNION ALL SELECT 'ted-lasso', 13
  UNION ALL SELECT 'guardian-galaxy', 1
  UNION ALL SELECT 'guardian-galaxy', 9
  UNION ALL SELECT 'guardian-galaxy', 6
  UNION ALL SELECT 'duty-after-school', 1
  UNION ALL SELECT 'duty-after-school', 2
  UNION ALL SELECT 'duty-after-school', 4
  UNION ALL SELECT 'alice-in-borderland', 4
  UNION ALL SELECT 'alice-in-borderland', 1
  UNION ALL SELECT 'alice-in-borderland', 2
  UNION ALL SELECT 'all-of-us-dead', 5
  UNION ALL SELECT 'all-of-us-dead', 4
  UNION ALL SELECT 'all-of-us-dead', 2
  UNION ALL SELECT 'avatar', 6
  UNION ALL SELECT 'avatar', 1
  UNION ALL SELECT 'avatar', 9
  UNION ALL SELECT 'avatar-way-of-water', 6
  UNION ALL SELECT 'avatar-way-of-water', 1
  UNION ALL SELECT 'avatar-way-of-water', 9
  UNION ALL SELECT 'the-batman', 1
  UNION ALL SELECT 'the-batman', 10
  UNION ALL SELECT 'the-batman', 2
  UNION ALL SELECT 'baymax', 8
  UNION ALL SELECT 'baymax', 3
  UNION ALL SELECT 'baymax', 14
  UNION ALL SELECT 'big-hero-6', 8
  UNION ALL SELECT 'big-hero-6', 1
  UNION ALL SELECT 'big-hero-6', 9
  UNION ALL SELECT 'black-adam', 1
  UNION ALL SELECT 'black-adam', 15
  UNION ALL SELECT 'black-adam', 11
  UNION ALL SELECT 'blue-lock', 13
  UNION ALL SELECT 'blue-lock', 8
  UNION ALL SELECT 'blue-lock', 2
  UNION ALL SELECT 'devil-judge', 2
  UNION ALL SELECT 'devil-judge', 4
  UNION ALL SELECT 'devil-judge', 10
  UNION ALL SELECT 'dilan-1990', 7
  UNION ALL SELECT 'dilan-1990', 2
  UNION ALL SELECT 'doctor-strange-multiverse', 1
  UNION ALL SELECT 'doctor-strange-multiverse', 11
  UNION ALL SELECT 'doctor-strange-multiverse', 5
  UNION ALL SELECT 'dont-look-up', 3
  UNION ALL SELECT 'dont-look-up', 2
  UNION ALL SELECT 'dont-look-up', 6
  UNION ALL SELECT 'fast-x', 1
  UNION ALL SELECT 'fast-x', 9
  UNION ALL SELECT 'fast-x', 4
  UNION ALL SELECT 'happiness', 4
  UNION ALL SELECT 'happiness', 5
  UNION ALL SELECT 'happiness', 2
  UNION ALL SELECT 'jurassic-world', 1
  UNION ALL SELECT 'jurassic-world', 9
  UNION ALL SELECT 'jurassic-world', 6
  UNION ALL SELECT 'little-mermaid', 11
  UNION ALL SELECT 'little-mermaid', 9
  UNION ALL SELECT 'megan', 5
  UNION ALL SELECT 'megan', 6
  UNION ALL SELECT 'megan', 4
  UNION ALL SELECT 'spider-verse', 8
  UNION ALL SELECT 'spider-verse', 1
  UNION ALL SELECT 'spider-verse', 9
  UNION ALL SELECT 'missing', 4
  UNION ALL SELECT 'missing', 12
  UNION ALL SELECT 'missing', 2
  UNION ALL SELECT 'my-hero-academia', 1
  UNION ALL SELECT 'my-hero-academia', 8
  UNION ALL SELECT 'my-hero-academia', 15
  UNION ALL SELECT 'my-perfect-stranger', 7
  UNION ALL SELECT 'my-perfect-stranger', 12
  UNION ALL SELECT 'my-perfect-stranger', 2
  UNION ALL SELECT 'man-called-otto', 3
  UNION ALL SELECT 'man-called-otto', 2
  UNION ALL SELECT 'ant-man-quantumania', 1
  UNION ALL SELECT 'ant-man-quantumania', 9
  UNION ALL SELECT 'ant-man-quantumania', 6
  UNION ALL SELECT 'rio', 8
  UNION ALL SELECT 'rio', 9
  UNION ALL SELECT 'rio', 3
  UNION ALL SELECT 'shazam-fury', 1
  UNION ALL SELECT 'shazam-fury', 11
  UNION ALL SELECT 'shazam-fury', 3
  UNION ALL SELECT 'sonic-2', 1
  UNION ALL SELECT 'sonic-2', 9
  UNION ALL SELECT 'sonic-2', 3
  UNION ALL SELECT 'stuart-little', 14
  UNION ALL SELECT 'stuart-little', 3
  UNION ALL SELECT 'stuart-little', 9
  UNION ALL SELECT 'tomorrow-war', 1
  UNION ALL SELECT 'tomorrow-war', 6
  UNION ALL SELECT 'tomorrow-war', 9
  UNION ALL SELECT 'suzume', 8
  UNION ALL SELECT 'suzume', 9
  UNION ALL SELECT 'suzume', 11
  UNION ALL SELECT 'light-shop', 12
  UNION ALL SELECT 'light-shop', 4
  UNION ALL SELECT 'light-shop', 5
  UNION ALL SELECT 'teach-you', 1
  UNION ALL SELECT 'teach-you', 2
  UNION ALL SELECT 'crash-land', 7
  UNION ALL SELECT 'crash-land', 3
  UNION ALL SELECT 'crash-land', 1
  UNION ALL SELECT 'doomsday', 1
  UNION ALL SELECT 'doomsday', 9
  UNION ALL SELECT 'doomsday', 6
  UNION ALL SELECT 'amazing-spidey', 1
  UNION ALL SELECT 'amazing-spidey', 9
  UNION ALL SELECT 'amazing-spidey', 6
  UNION ALL SELECT 'spidey-brand-new-day', 1
  UNION ALL SELECT 'spidey-brand-new-day', 9
  UNION ALL SELECT 'spidey-brand-new-day', 6
) AS v
JOIN contents c ON c.slug = v.content_slug;

INSERT INTO content_recommendations (content_id, recommended_content_id, order_position)
SELECT c1.id, c2.id, v.order_position
FROM (
  SELECT 'guardian-galaxy' AS content_slug, 'avatar' AS recommended_slug, 0 AS order_position
  UNION ALL SELECT 'guardian-galaxy', 'the-batman', 1
  UNION ALL SELECT 'guardian-galaxy', 'black-adam', 2
  UNION ALL SELECT 'guardian-galaxy', 'ant-man-quantumania', 3
  UNION ALL SELECT 'avatar', 'avatar-way-of-water', 0
  UNION ALL SELECT 'avatar', 'guardian-galaxy', 1
  UNION ALL SELECT 'avatar', 'jurassic-world', 2
  UNION ALL SELECT 'the-batman', 'black-adam', 0
  UNION ALL SELECT 'the-batman', 'shazam-fury', 1
  UNION ALL SELECT 'the-batman', 'doctor-strange-multiverse', 2
  UNION ALL SELECT 'doomsday', 'avatar', 0
  UNION ALL SELECT 'doomsday', 'the-batman', 1
  UNION ALL SELECT 'doomsday', 'black-adam', 2
  UNION ALL SELECT 'doomsday', 'ant-man-quantumania', 3
  UNION ALL SELECT 'amazing-spidey', 'avatar', 0
  UNION ALL SELECT 'amazing-spidey', 'the-batman', 1
  UNION ALL SELECT 'amazing-spidey', 'black-adam', 2
  UNION ALL SELECT 'amazing-spidey', 'ant-man-quantumania', 3
  UNION ALL SELECT 'spidey-brand-new-day', 'avatar', 0
  UNION ALL SELECT 'spidey-brand-new-day', 'the-batman', 1
  UNION ALL SELECT 'spidey-brand-new-day', 'black-adam', 2
  UNION ALL SELECT 'spidey-brand-new-day', 'ant-man-quantumania', 3
) AS v
JOIN contents c1 ON c1.slug = v.content_slug
JOIN contents c2 ON c2.slug = v.recommended_slug;