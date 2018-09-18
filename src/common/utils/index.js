/**
 * @fileOverview toolkit
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-09-11 | sizhao  // 初始版本
*/

export function updateTag (tagName, keyName, keyValue, attrName, attrValue) {
  const node = document.head.querySelector(`${tagName}[${keyName}="${keyValue}"]`)

  if (node && node.getAttribute(attrName) === attrValue) {
    return
  }

  if (node && typeof attrValue === 'string') {
    node.parentNode.removeChild(node)
    const newNode = document.createElement(tagName)
    newNode.setAttribute(keyName, keyValue)
    newNode.setAttribute(attrName, attrValue)
    document.head.appendChild(newNode)
  }
}

export function updateMeta (name, content) {
  updateTag('meta', 'name', name, 'content', content)
}
