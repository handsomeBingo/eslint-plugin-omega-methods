"use strict";

const path = require("path");

module.exports = {
  meta: {
    type: "error",
    docs: {
      description: "Ensure exported methods in omega directories are prefixed with $omega",
      category: "Possible Errors",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      missingPrefix: "Exported method '{{name}}' in omega directory must start with '$omega'",
    },
  },

  create(context) {
    // 获取当前文件的绝对路径
    const filename = context.getFilename();
    const absolutePath = path.resolve(filename);

    // 检查路径中是否包含 '/omega/' 或 '\omega\' (跨平台兼容)
    const isInOmegaDir = /[\\/]omega[\\/]/i.test(absolutePath);

    if (!isInOmegaDir) {
      // 如果不在 omega 目录中，不进行检查
      return {};
    }

    // 存储导出的变量名
    const exportedNames = new Set();

    return {
      // 收集 export const/let 声明的变量名
      "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator"(node) {
        if (node.id && node.id.name) {
          exportedNames.add(node.id.name);
        }
      },

      // 收集 export { identifier } 中的标识符
      "ExportNamedDeclaration > ExportSpecifier"(node) {
        if (node.exported.name) {
          exportedNames.add(node.exported.name);
        }
      },

      // 检查导出的函数声明
      "ExportNamedDeclaration > FunctionDeclaration"(node) {
        if (node.id && node.id.name && !node.id.name.startsWith("$omega")) {
          context.report({
            node: node.id, messageId: "missingPrefix", data: {
              name: node.id.name,
            },
          });
        }
      },

      // 检查 export default 的函数
      "ExportDefaultDeclaration > FunctionDeclaration"(node) {
        if (node.id && node.id.name && !node.id.name.startsWith("$omega")) {
          context.report({
            node: node.id, messageId: "missingPrefix", data: {
              name: node.id.name,
            },
          });
        }
      },

      // 检查 export default 的箭头函数或函数表达式
      "ExportDefaultDeclaration > ArrowFunctionExpression, ExportDefaultDeclaration > FunctionExpression"(node) {
        // 对于匿名函数，我们无法检查名称，所以跳过
        // 如果有需要可以检查父级赋值的情况
      },

      // 检查导出的变量声明中的函数
      "VariableDeclarator > ArrowFunctionExpression, VariableDeclarator > FunctionExpression"(node) {
        const variableDeclarator = node.parent;
        if (variableDeclarator.id && variableDeclarator.id.name && exportedNames.has(variableDeclarator.id.name) && !variableDeclarator.id.name.startsWith("$omega")) {
          context.report({
            node: variableDeclarator.id,
            messageId: "missingPrefix",
            data: {
              name: variableDeclarator.id.name,
            },
          });
        }
      },
    };
  },
};
