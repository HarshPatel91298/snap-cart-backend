
const { PERMISSIONS } = require("../lib/accessControl");
const { ForbiddenError } = require("apollo-server-express");
const { authenticateAndAuthorize } = require("../lib/auth"); // Import your auth utility
const { Attachment } = require("../models/attachmentModel");

const attachmentResolver = {
    Query: {
        attachments: async (_, __, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.READ, "attachment");

            const attachments = await Attachment.find();
            return {
                status: true,
                data: attachments,
                message: "Attachments fetched successfully",
            };
        },
        attachmentById: async (_, { id }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.READ, "attachment");

            const attachment = await Attachment.findById(id);
            if (!attachment) {
                throw new ForbiddenError("Attachment not found");
            }

            return { status: true, data: attachment, message: "Attachment found" };
        },
    },
    Mutation: {
        addAttachment: async (_, { attachmentInput }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "attachment");

            const newAttachment = new Attachment(attachmentInput);
            const attachment = await newAttachment.save();
            return {
                status: true,
                data: attachment,
                message: "Attachment created successfully",
            };
        },
        updateAttachment: async (_, { id, attachmentInput }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "attachment");

            const updatedAttachment = await Attachment.findByIdAndUpdate(id, attachmentInput, {
                new: true,
            });
            if (!updatedAttachment) {
                throw new ForbiddenError("Attachment not found");
            }

            return {
                status: true,
                data: updatedAttachment,
                message: "Attachment updated successfully",
            };
        },
        deleteAttachment: async (_, { id }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "attachment");

            const deletedAttachment = await Attachment.findByIdAndDelete(id);
            if (!deletedAttachment) {
                throw new ForbiddenError("Attachment not found");
            }

            return {
                status: true,
                data: deletedAttachment,
                message: "Attachment deleted successfully",
            };
        },
    },
};

module.exports = { attachmentResolver };