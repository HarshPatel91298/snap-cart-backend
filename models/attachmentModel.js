const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Create a new attachment
async function createAttachment(attachmentData) {
    try {
        // Create a new attachment
        const attachment = new Attachment(attachmentData);
        const newAttachment = await attachment.save();
        console.log("Attachment created:", newAttachment);
        return newAttachment;
    }
    catch (error) {
        console.error("Error creating attachment:", error);
    }
}

// Get all attachments
async function getAttachments() {
    try {
        // Find all attachments
        const attachments = await Attachment.find();
        return attachments;
    }
    catch (error) {
        throw new Error(error.message);
    }
}

// Get attachment by ID
async function getAttachmentById(id) {
    try {
        // Find an attachment by ID
        const attachment = await Attachment.findById(id);
        return attachment;
    }
    catch (error) {
        throw new Error(error.message);
    }
}

// Update attachment by ID
async function updateAttachment(id, attachmentData) {
    try {
        // Find an attachment by ID and update
        attachmentData.updated_at = Date.now();
        const updatedAttachment = await Attachment.findByIdAndUpdate(id, attachmentData, { new: true });
        console.log("Attachment updated:", updatedAttachment);
        return updatedAttachment;
    }
    catch (error) {
        throw new Error(error.message);
    }
}

// Delete attachment by ID
async function deleteAttachment(id) {
    try {
        // Find an attachment by ID and delete
        const deletedAttachment = await Attachment.findByIdAndDelete(id);
        console.log("Attachment deleted:", deletedAttachment);
        return deletedAttachment;
    }
    catch (error) {
        throw new Error(error.message);
    }
}

// Export the model and functions
attachmentSchema.statics.createAttachment = createAttachment;
attachmentSchema.statics.getAttachments = getAttachments;
attachmentSchema.statics.getAttachmentById = getAttachmentById;
attachmentSchema.statics.updateAttachment = updateAttachment;
attachmentSchema.statics.deleteAttachment = deleteAttachment;


const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = {Attachment};
