const subscriptionPlans = [
  {
    id: 'individual',
    name: 'Individu',
    price: 'Rp 49.990',
    period: '/bulan',
    users: '1 Akun',
    features: [
      { icon: 'ads', text: 'Tidak ada iklan' },
      { icon: 'fourK', text: 'Kualitas 720p' },
      { icon: 'download', text: 'Download konten pilihan' }
    ]
  },
  {
    id: 'duo',
    name: 'Berdua',
    price: 'Rp 79.990',
    period: '/bulan',
    users: '2 Akun',
    features: [
      { icon: 'ads', text: 'Tidak ada iklan' },
      { icon: 'fourK', text: 'Kualitas 1080p' },
      { icon: 'download', text: 'Download konten pilihan' }
    ]
  },
  {
    id: 'family',
    name: 'Keluarga',
    price: 'Rp 159.990',
    period: '/bulan',
    users: '5-7 Akun',
    features: [
      { icon: 'ads', text: 'Tidak ada iklan' },
      { icon: 'fourK', text: 'Kualitas 4K' },
      { icon: 'download', text: 'Download konten pilihan' }
    ]
  },
];


export default subscriptionPlans;