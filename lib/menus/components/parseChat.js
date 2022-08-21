const styles = {
	  black: 'color:#000000',
	  dark_blue: 'color:#0000AA',
	  dark_green: 'color:#00AA00',
	  dark_aqua: 'color:#00AAAA',
	  dark_red: 'color:#AA0000',
	  dark_purple: 'color:#AA00AA',
	  gold: 'color:#FFAA00',
	  gray: 'color:#AAAAAA',
	  dark_gray: 'color:#555555',
	  blue: 'color:#5555FF',
	  green: 'color:#55FF55',
	  aqua: 'color:#55FFFF',
	  red: 'color:#FF5555',
	  light_purple: 'color:#FF55FF',
	  yellow: 'color:#FFFF55',
	  white: 'color:#FFFFFF',
	  bold: 'font-weight:900',
	  strikethrough: 'text-decoration:line-through',
	  underlined: 'text-decoration:underline',
	  italic: 'font-style:italic'
	}

function colorShadow (hex, dim = 0.25) {
	const color = parseInt(hex.replace('#', ''), 16)

	const r = (color >> 16 & 0xFF) * dim | 0
	const g = (color >> 8 & 0xFF) * dim | 0
	const b = (color & 0xFF) * dim | 0

	const f = (c) => ('00' + c.toString(16)).substr(-2)
	return `#${f(r)}${f(g)}${f(b)}`
}

function parseChatFormat (packet) {
	// Reading of chat message
	const fullmessage = JSON.parse(packet.message.toString());
	const msglist = []

	const colorF = (color) => {
		return color.trim().startsWith('#') ? `color:${color}` : styles[color] ?? undefined
	}

	const readMsg = (msglist, msg) => {
	const styles = {
	  color: msg.color,
	  bold: !!msg.bold,
	  italic: !!msg.italic,
	  underlined: !!msg.underlined,
	  strikethrough: !!msg.strikethrough,
	  obfuscated: !!msg.obfuscated
	}

	if (msg.text) {
	  msglist.push({
		text: msg.text,
		...styles
	  })
	}

	if (msg.translate) {
	  const tText = window.mcData.language[msg.translate] ?? msg.translate

	  if (msg.with) {
		const splited = tText.split(/%s|%\d+\$s/g)

		let i = 0
		splited.forEach((spl, j, arr) => {
		  msglist.push({ text: spl, ...styles })

		  if (j + 1 < arr.length) {
			if (msg.with[i]) {
			  if (typeof msg.with[i] === 'string') {
				readMsg(msglist, {
				  ...styles,
				  text: msg.with[i]
				})
			  } else {
				readMsg(msglist, {
				  ...styles,
				  ...msg.with[i]
				})
			  }
			}
			i++
		  }
		})
	  } else {
		msglist.push({
		  text: tText,
		  ...styles
		})
	  }
	}

	if (msg.extra) {
	  msg.extra.forEach(ex => {
		readMsg(msglist, { ...styles, ...ex })
	  })
	}
	}

	readMsg(msglist, fullmessage)

	const li = document.createElement('li')
	msglist.forEach(msg => {
		const span = document.createElement('span')
		span.appendChild(document.createTextNode(msg.text))
		span.setAttribute(
		  'style',
				`${msg.color ? colorF(msg.color.toLowerCase()) + `; text-shadow: 1px 1px 0px ${colorShadow(colorF(msg.color.toLowerCase()).replace('color:', ''))}` : styles.white}; ${
				msg.bold ? styles.bold + ';' : ''
				}${msg.italic ? styles.italic + ';' : ''}${
				msg.strikethrough ? styles.strikethrough + ';' : ''
				}${msg.underlined ? styles.underlined + ';' : ''}`
		)
		li.appendChild(span)
	})
	
	return li
}

export {
	parseChatFormat
}