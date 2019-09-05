import { warn } from '../utils/log'
import { isFunction } from '../utils/unit'
import { ERROR, NO_SLIDES_ERROR, SUCCESS } from '../errors'

/**
 * Creates and initializes specified collection of extensions.
 * Each extension receives access to instance of glide and rest of components.
 *
 * @param {Object} glide
 * @param {Object} extensions
 *
 * @returns {Object}
 */
export function mount (glide, extensions, events) {
  let components = {}

  for (let name in extensions) {
    if (isFunction(extensions[name])) {
      components[name] = extensions[name](glide, components, events)
    } else {
      warn('Extension must be a function')
    }
  }

  for (let name in components) {
    if (isFunction(components[name].mount)) {
      try {
        components[name].mount()
      } catch (e) {
        switch (name) {
          case 'html':
            if (e.message === NO_SLIDES_ERROR) {
              return [ERROR, glide.log(e.message)]
            }
            break
          default:
            break
        }
      }
    }
  }

  return [SUCCESS, components]
}
