// Import
const connection = require('../data/bnb_db');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

// Index
const index = (req, res) => {
    // console.log("Sto inviando i dati");

    // prendo i query params
    let { indirizzo_completo, stanzeMin, postiLettoMin, tipologia } = req.query
    let filters = []
    let values = []

    // Filtro per città o indirizzo (anche parziale)
    if (indirizzo_completo) {
        filters.push("indirizzo_completo LIKE ?");
        values.push(`%${indirizzo_completo}%`);
    }

    // Filtro per numero minimo di stanze e posti letto
    if (stanzeMin) {
        filters.push("numero_camere >= ?");
        values.push(parseInt(stanzeMin));
    }

    if (postiLettoMin) {
        filters.push("numero_letti >= ?");
        values.push(parseInt(postiLettoMin));
    }

    // Filtro per tipologia di immobile
    if (tipologia) {
        filters.push("tipologia = ?");
        values.push(tipologia);
    }

    // preparo la query iniziale
    let sql = `
        SELECT * FROM annunci
    `

    if (filters.length > 0) {
        sql += " WHERE " + filters.join(" AND ");
    }

    // ordina la query finale per n. di cuoricini
    sql += " ORDER BY likes DESC"

    connection.query(sql, values, (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' })
        res.status(200).json({ data: result })
    });
};

// Show
const show = (req, res) => {
    const slug = req.params.slug

    const announcementSql = `
        SELECT * 
        FROM annunci 
        WHERE slug = ?
    `

    const reviewsSql = `
        SELECT recensioni.* 
        FROM  annunci
        JOIN recensioni
        ON annunci.id = recensioni.annuncio_id
        WHERE annunci.slug = ?
    `

    connection.query(announcementSql, [slug], (err, announcementResults) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' })
        if (announcementResults.length === 0 || announcementResults.id === null) {
            return res.status(404).json({ error: "item not found" })
        }
        // recuperare l'annuncio
        const announcement = announcementResults[0]

        connection.query(reviewsSql, [slug], (err, reviewResults) => {
            if (err)
                return res.status(500).json({ error: 'Database query failed' })

            announcement.review = reviewResults

            res.status(200).json(announcement)
        })
    })
}

// Store House
const storeHouse = (req, res) => {

    const data_creazione = new Date();
    const { titolo_annuncio, descrizione_annuncio, tipologia, metri_quadrati, indirizzo_completo, numero_camere, numero_letti, numero_bagni, email_proprietario, stato_annuncio, descrizione_foto } = req.body
    const uuid = uuidv4()

    const titoloAnnuncio = titolo_annuncio ? titolo_annuncio.toString() : "annuncio-senza-titolo";
    const slug = slugify(titoloAnnuncio, { lower: true, strict: true });

    const houseSql = `
        INSERT INTO annunci(uuid, slug, titolo_annuncio, descrizione_annuncio, tipologia, metri_quadrati, likes, indirizzo_completo, numero_camere, numero_letti, numero_bagni, email_proprietario, stato_annuncio, data_creazione)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const photoSql = `
        INSERT INTO foto(annuncio_id, url_foto, descrizione_foto)
        VALUES (?, ?, ?)
    `

    connection.query(houseSql, [uuid, slug, titolo_annuncio, descrizione_annuncio, tipologia, metri_quadrati, 0, indirizzo_completo, numero_camere, numero_letti, numero_bagni, email_proprietario, stato_annuncio, data_creazione], (err, houseResult) => {

        if (err)
            return res.status(500).json({ error: "Database query failed", err: err.stack })
        if (houseResult === 0 || houseResult === undefined) {
            return res.status(500).json({ error: "Result empty or not found", err: err.stack })
        }
        // recupera l'annuncio dal risultato della query
        const annuncio_id = houseResult.insertId

        // verifica se le foto sono aggiunte o meno
        if (!req.files || req.files.length === 0) {
            return res.status(201).json({ message: "Appartamento aggiunto senza immagini" });
        }

        // se le foto sono state aggiunte, le salva nel db
        const photoPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                connection.query(photoSql, [annuncio_id, file.filename, descrizione_foto], (err, photoResult) => {
                    if (err) reject(err);
                    else resolve(photoResult);
                });
            });
        });

        Promise.all(photoPromises)
            .catch(err => res.status(500).json({ error: "Database query failed", err: err.stack }))
            .then(() => res.status(201).json({ message: "Appartamento e immagini aggiunti con successo!" }))
    })
};

// Store review
const storeReview = (req, res) => {
    const announcementId = req.params.id
    const { utente_id, nome, commento, giorni_permanenza, data_recensione } = req.body

    const sql = `
        INSERT INTO recensioni( utente_id, annuncio_id, nome, commento, giorni_permanenza, data_recensione)
        VALUES (?,?,?,?,?,?)    
    `
    connection.query(sql, [utente_id, announcementId, nome, commento, giorni_permanenza, data_recensione], (err, results) => {
        if (err)
            return res.status(500).json({ error: "Database query failed", err: err.stack })
        if (announcementId === null)
            return res.status(404).json({ error: "Item not found" })
        res.status(201).json({ message: "Recensione aggiunta" })
    })
}

// Store like
const storeLike = (req, res) => {
    const announcementId = req.params.id
    const { utente_id } = req.body
    const data_assegnazione = new Date();

    const sql = `
        UPDATE annunci
        SET likes = likes + 1
        WHERE annunci.id = ?
    `

    const addLikeSql = `
        INSERT INTO Cuoricini(utente_id, annuncio_id, data_assegnazione)
        VALUES (?, ?, ?)
    `

    connection.query(sql, [announcementId], (err, result) => {
        if (err)
            return res.status(500).json({ error: "Database query failed", err: err.stack })
        if (announcementId === null)
            return res.status(404).json({ error: "Item not found" })

        connection.query(addLikeSql, [utente_id, announcementId, data_assegnazione], (err, addLikeResult) => {
            if (err)
                return res.status(500).json({ error: "Database query failed", err: err.stack })
            res.status(201).json({ message: "Like aggiornato e aggiunto" })
        })
    })
}

// Destroy
const destroy = (req, res) => {

};

module.exports = {
    index,
    show,
    storeHouse,
    storeReview,
    storeLike,
    destroy
}