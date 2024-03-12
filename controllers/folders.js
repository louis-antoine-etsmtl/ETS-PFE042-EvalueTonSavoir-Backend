const model = require('../models/folders.js');

const AppError = require('../middleware/AppError.js');
const { MISSING_REQUIRED_PARAMETER, NOT_IMPLEMENTED, FOLDER_NOT_FOUND, FOLDER_ALREADY_EXISTS, GETTING_FOLDER_ERROR, DELETE_FOLDER_ERROR, UPDATE_FOLDER_ERROR, MOVING_FOLDER_ERROR, DUPLICATE_FOLDER_ERROR, COPY_FOLDER_ERROR } = require('../constants/errorCodes');

class FoldersController {

    /***
     * Basic queries
     */
    async create(req, res) {
        try {
            const { title } = req.body;

            if (!title) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            const result = await model.create(title, req.user.userId);

            if (!result) {
                throw new AppError(FOLDER_ALREADY_EXISTS);
            }

            return res.status(200).json({
                message: 'Dossier créé avec succès.'
            });

        }
        catch (error) {
            return next(error);
        }
    }

    async getUserFolders(req, res) {

        try {
            const folders = await model.getUserFolders(req.user.userId);

            if (!folders) {
                throw new AppError(FOLDER_NOT_FOUND);
            }

            return res.status(200).json({
                data: folders
            });

        }
        catch (error) {
            return next(error);
        }
    }

    async getFolderContent(req, res) {
        try {
            const { folderId } = req.params;

            if (!folderId) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            // Is this folder mine
            const owner = await model.getOwner(folderId);

            if (owner != req.user.userId) {
                throw new AppError(FOLDER_NOT_FOUND);
            }

            const content = await model.getContent(folderId);

            if (!content) {
                throw new AppError(GETTING_FOLDER_ERROR);
            }

            return res.status(200).json({
                data: content
            });

        }
        catch (error) {
            return next(error);
        }
    }

    async delete(req, res) {
        try {
            const { folderId } = req.params;

            if (!folderId) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            // Is this folder mine
            const owner = await model.getOwner(folderId);

            if (owner != req.user.userId) {
                throw new AppError(FOLDER_NOT_FOUND);
            }

            const result = await model.delete(folderId);

            if (!result) {
                throw new AppError(DELETE_FOLDER_ERROR);
            }

            return res.status(200).json({
                message: 'Dossier supprimé avec succès.'
            });

        }
        catch (error) {
            return next(error);
        }
    }

    async rename(req, res) {
        try {
            const { folderId, newTitle } = req.body;

            if (!folderId || !newTitle) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            // Is this folder mine
            const owner = await model.getOwner(folderId);

            if (owner != req.user.userId) {
                throw new AppError(FOLDER_NOT_FOUND);
            }

            const result = await model.rename(folderId, newTitle);

            if (!result) {
                throw new AppError(UPDATE_FOLDER_ERROR);
            }

            return res.status(200).json({
                message: 'Dossier mis à jours avec succès.'
            });

        }
        catch (error) {
            return next(error);
        }
    }


    /**
     * Sharing and advance queries
     */
    async duplicate(req, res) {
        const { folderId, newTitle } = req.body;

        if (!folderId || !newTitle) {
            throw new AppError(MISSING_REQUIRED_PARAMETER);
        }

        throw new AppError(NOT_IMPLEMENTED);

        // try {
        //     //Trouver le folder a dupliquer 
        //     const conn = db.getConnection();
        //     const folderToDuplicate = await conn.collection('folders').findOne({ _id: new ObjectId(folderId) });
        //     if (!folderToDuplicate) {
        //         throw new Error("Dossier non trouvé");
        //     }
        //     //Suppression du id du folder pour ne pas le répliquer 
        //     delete folderToDuplicate._id;
        //     //Ajout du duplicata
        //     const newFolder = await conn.collection('folders').insertOne({ ...folderToDuplicate });
        //     res.json(Response.ok("Dossier dupliqué"));

        // } catch (error) {
        //     if (error.message.startsWith("Aucun dossier trouvé")) {
        //         return res.status(404).json(Response.badRequest(error.message));
        //     }
        //     res.status(500).json(Response.serverError(error.message));
        // }
    }

    async copy(req, res) {
        const { folderId, newTitle } = req.body;

        if (!folderId || !newTitle) {
            throw new AppError(MISSING_REQUIRED_PARAMETER);
        }

        throw new AppError(NOT_IMPLEMENTED);



        // const { folderId } = req.params;
        // const { newUserId } = req.body;
        // console.log(folderId);
        // try {
        //     //Trouver le folder a dupliquer 
        //     const conn = db.getConnection();
        //     const folderToDuplicate = await conn.collection('folders').findOne({ _id: new ObjectId(folderId) });
        //     if (!folderToDuplicate) {
        //         throw new Error("Dossier non trouvé");
        //     }
        //     console.log(folderToDuplicate);
        //     //Suppression du id du folder pour ne pas le répliquer 
        //     delete folderToDuplicate._id;
        //     //Ajout du duplicata
        //     await conn.collection('folders').insertOne({ ...folderToDuplicate, userId: new ObjectId(newUserId) });
        //     res.json(Response.ok("Dossier dupliqué avec succès pour un autre utilisateur"));

        // } catch (error) {
        //     if (error.message.startsWith("Aucun dossier trouvé")) {
        //         return res.status(404).json(Response.badRequest(error.message));
        //     }
        //     res.status(500).json(Response.serverError(res, error.message));
        // }
    }

}

module.exports = new FoldersController;