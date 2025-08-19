"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {

    class TruyenQuanTruong extends Model {
        // Khai báo class `TruyenQuanTruong` kế thừa từ Sequelize `Model`.

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Định nghĩa các mối quan hệ (association) với các model khác tại đây nếu cần.
        }
    }

    TruyenQuanTruong.init(
        {
            Slug: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '', // 🔹 Thêm giá trị mặc định
                validate: {
                    notNull: { msg: "ImageLinks is required" },
                },
            },
            ImageLinks: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "ImageLinks is required" },
                },
            },
            Title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "TitleIntro is required" },
                },
            },
            LinkComic: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "TitleIntro is required" },
                },
            },
            Author: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "NameComic is required" },
                },
            },
            Chapters: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Rating is required" },
                },
            },
            // StatusCrawler: Number // 0: Đang cập nhật, 1: Full ?? fixx this heres
        },
        {
            sequelize,
            modelName: "TruyenQuanTruong",
            freezeTableName: true,
            tableName: "TruyenQuanTruong",
            timestamps: true,
        }
    );

    return TruyenQuanTruong;
}


