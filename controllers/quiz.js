const model = require('../models/quiz.js');
const folderModel = require('../models/folders.js');

const AppError = require('../middleware/AppError.js');
const { MISSING_REQUIRED_PARAMETER, NOT_IMPLEMENTED, QUIZ_NOT_FOUND, FOLDER_NOT_FOUND, QUIZ_ALREADY_EXISTS, GETTING_QUIZ_ERROR, DELETE_QUIZ_ERROR, UPDATE_QUIZ_ERROR, MOVING_QUIZ_ERROR, DUPLICATE_QUIZ_ERROR, COPY_QUIZ_ERROR } = require('../constants/errorCodes');

class QuizController {

    async create(req, res) {
        try {
            const { title, content, folderId } = req.body;

            if (!title || !content || !folderId) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            // Is this folder mine
            const owner = await folderModel.getOwner(folderId);

            if (owner != req.user.userId) {
                throw new AppError(FOLDER_NOT_FOUND);
            }

            const result = await model.create(title, content, folderId, req.user.userId);

            if (!result) {
                throw new AppError(QUIZ_ALREADY_EXISTS);
            }

            return res.status(200).json({
                message: 'Quiz créé avec succès.'
            });

        }
        catch (error) {
            return next(error);
        }
    }

    async get(req, res) {
        try {
            const { quizId } = req.params;

            if (!quizId) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }


            const content = await model.getContent(quizId);

            if (!content) {
                throw new AppError(GETTING_QUIZ_ERROR);
            }

            // Is this quiz mine
            if (content.userId != req.user.userId) {
                throw new AppError(QUIZ_NOT_FOUND);
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
            const { quizId } = req.params;

            if (!quizId) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            // Is this quiz mine
            const owner = await model.getOwner(quizId);

            if (owner != req.user.userId) {
                throw new AppError(QUIZ_NOT_FOUND);
            }

            const result = await model.delete(quizId);

            if (!result) {
                throw new AppError(DELETE_QUIZ_ERROR);
            }

            return res.status(200).json({
                message: 'Quiz supprimé avec succès.'
            });

        }
        catch (error) {
            return next(error);
        }
    }

    async update(req, res) {
        try {
            const { quizId, newTitle, newContent } = req.body;

            if (!newTitle || !newContent || !quizId) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            // Is this quiz mine
            const owner = await model.getOwner(quizId);

            if (owner != req.user.userId) {
                throw new AppError(QUIZ_NOT_FOUND);
            }

            const result = await model.update(quizId, newTitle, newContent);

            if (!result) {
                throw new AppError(UPDATE_QUIZ_ERROR);
            }

            return res.status(200).json({
                message: 'Quiz mis à jours avec succès.'
            });

        }
        catch (error) {
            return next(error);
        }
    }

    async move(req, res) {
        try {
            const { quizId, newFolderId } = req.body;

            if (!quizId || !newFolderId) {
                throw new AppError(MISSING_REQUIRED_PARAMETER);
            }

            // Is this quiz mine
            const quizOwner = await model.getOwner(quizId);

            if (quizOwner != req.user.userId) {
                throw new AppError(QUIZ_NOT_FOUND);
            }

            // Is this folder mine
            const folderOwner = await folderModel.getOwner(newFolderId);

            if (folderOwner != req.user.userId) {
                throw new AppError(FOLDER_NOT_FOUND);
            }

            const result = await model.move(quizId, newFolderId);

            if (!result) {
                throw new AppError(MOVING_QUIZ_ERROR);
            }

            return res.status(200).json({
                message: 'Utilisateur déplacé avec succès.'
            });

        }
        catch (error) {
            return next(error);
        }

    }

    async duplicate(req, res) {
        const { quizId, newTitle } = req.body;

        if (!quizId || !newTitle) {
            throw new AppError(MISSING_REQUIRED_PARAMETER);
        }

        throw new AppError(NOT_IMPLEMENTED);
        // const { quizId } = req.params;
        // const { quiz } = req.body;

        // try {
        //     //Trouver le quizz a dupliquer 
        //     const conn = db.getConnection();
        //     const quiztoduplicate = await conn.collection('quiz').findOne({ _id: quizId });
        //     if (!quiztoduplicate) {
        //         throw new Error("quiz non trouvé");
        //     }

        //     //changement du id du folder pour ne pas le répliquer 
        //     const { _id, title, questions = [] } = quiz;
        //     console.log(_id);
        //     quiztoduplicate._id = _id;
        //     quiztoduplicate.title = title;

        //     //Ajout du duplicata
        //     await conn.collection('quiz').insertOne({ ...quiztoduplicate });
        //     res.json(Response.ok("quiz dupliqué"));

        // } catch (error) {
        //     if (error.message.startsWith("quiz non trouvé")) {
        //         return res.status(404).json(Response.badRequest(error.message));
        //     }
        //     res.status(500).json(Response.serverError(error.message));
        // }
    }

    async copy(req, res) {
        const { quizId, newTitle } = req.body;

        if (!quizId || !newTitle) {
            throw new AppError(MISSING_REQUIRED_PARAMETER);
        }

        throw new AppError(NOT_IMPLEMENTED);
        // const { quizId } = req.params;
        // const { newUserId } = req.body;

        // try {
        //     //Trouver le quiz a dupliquer 
        //     const conn = db.getConnection();
        //     const quiztoduplicate = await conn.collection('quiz').findOne({ _id: new ObjectId(quizId) });
        //     if (!quiztoduplicate) {
        //         throw new Error("Quiz non trouvé");
        //     }
        //     console.log(quiztoduplicate);
        //     //Suppression du id du quiz pour ne pas le répliquer 
        //     delete quiztoduplicate._id;
        //     //Ajout du duplicata
        //     await conn.collection('quiz').insertOne({ ...quiztoduplicate, userId: new ObjectId(newUserId) });
        //     res.json(Response.ok("Dossier dupliqué avec succès pour un autre utilisateur"));

        // } catch (error) {
        //     if (error.message.startsWith("Quiz non trouvé")) {
        //         return res.status(404).json(Response.badRequest(error.message));
        //     }
        //     res.status(500).json(Response.serverError(error.message));
        // }
    }

}

module.exports = new QuizController;