const datatest = [
    {
        id: 1,
        title: "Monolocale accogliente nel centro di Roma",
        description: "Appartamento moderno con tutti i comfort, vicino ai trasporti pubblici.",
        price_per_night: 85,
        city: "Roma",
        country: "Italia",
        host: {
            id: 101,
            name: "Giulia Rossi",
            is_superhost: true
        },
        amenities: ["WiFi", "Aria condizionata", "Cucina"],
        rating: 4.8,
        reviews_count: 120
    },
    {
        id: 2,
        title: "Loft con vista sul Duomo di Milano",
        description: "Loft di design con vista spettacolare, perfetto per coppie.",
        price_per_night: 150,
        city: "Milano",
        country: "Italia",
        host: {
            id: 102,
            name: "Marco Bianchi",
            is_superhost: false
        },
        amenities: ["WiFi", "TV", "Lavatrice"],
        rating: 4.6,
        reviews_count: 98
    },
    {
        id: 3,
        title: "Villa con piscina in Costa Smeralda",
        description: "Lusso e relax in una villa con piscina privata e giardino.",
        price_per_night: 350,
        city: "Porto Cervo",
        country: "Italia",
        host: {
            id: 103,
            name: "Francesca Verdi",
            is_superhost: true
        },
        amenities: ["Piscina", "WiFi", "Parcheggio gratuito"],
        rating: 4.9,
        reviews_count: 45
    }
];

module.exports = datatest;