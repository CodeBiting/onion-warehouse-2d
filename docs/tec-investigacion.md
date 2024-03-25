\---------------------------------------------------------------------------------

**COMPLEJIDAD:**

**Baja**:

- Tabla HTML, Divs + Css

**Intermedia**:

- Phaser, Pixi, D3, Three

**Alta:**

- Cocos2d-x, Construct 3

—----------------------------------------------------------------------------

**FUNCIONALIDADES**:

**Poco Avance**:

- Cocos2d-x y Construc 3

**Avance Promedio**:

- Tabla Html, Divs + Css, D3

**Mucho Avance**:

- Phaser, Pixi, Three

\------------------------------------------------------------------------------

**Mejor Compatibilidad con JS y Node**

**Poco**

- Cocos2d-x, Construct

**Intermedio**

- D3

**Mucha**

- Phaser, Pixi, Three, Tabla HTML, Divs + Css

\-----------------------------------------------------------------------------------

**Mi punto de vista**:

He separado mi opinión en 3 puntos importantes, la complejidad que conlleva utilizar esas herramientas, las funcionalidades logradas o futuras y la compatibilidad para usar js e implementación en Node.

La complejidad a niveles bajos con Tabla HTML, Divs + Css están muy bien pero dejan mucho que desear si lo comparamos con las funcionalidades que nos permiten las herramientas como Three, D3, Pixi o Phaser. Respecto a Construct 3 y Cocos2d a niveles de código e implementación han dado problemas.

Las herramientas Three, D3 , Pixi o Phaser tienen un nivel de complejidad media-alta y lo único que los diferencia es para qué entorno están preparados. Three es una herramienta que está más orientada al 3d que las demás mientras que las otras se centran en su totalidad en 2d o llevan algunas capacidades 3d.

En donde tuve más avance fue en Pixi donde logré las mayores funcionalidades de zoom y movilidad en el mapa gracias a pixi viewport, seguido tenemos a Phaser donde logré más de lo mismo pero sin ayuda de otra biblioteca.

Three.js que pese a que tuve que especificarle OrthographicCamera para que lo mostrara 2d por no crear una etiqueta svg o canvas en su momento, obtuve buenos resultados y con funcionalidades decentes.

Con D3 no conseguí las funcionalidades de los demás quizás por inexperiencia mía o no saber buscar bien pero seguro que tiene el mismo potencial que los demás.

La compatibilidad con Node y que se pueda trabajar en JS es algo muy notorio como por ejemplo en Construct 3 y Cocos2d-x ya que en Cocos pese a que si puede trabajar un poco más con JS tienes que crear un proyecto a parte, el cual me resultó confuso a la hora de querer hacer algo con el renderizado gráfico del juego además que Cocos2d-x está más centrado en el desarrollo de aplicaciones nativas.

Con Construct 3 el problema que tuve es que está más diseñado a la creación de juegos sin programación, no me dejaba crear el mapa como yo quería en su página web a parte tiene un límite de lo que puedas crear porque es de pago y yo use el free trial. Por lo que su integración a Node no lo vi necesario.

El único que me gustó relaciono con renderización de juego fue Phaser, ya que me dejo interactuar con él casi sin problemas desde el mismo Node.js y habiendo conseguido muchos avances en el.

Los restantes que son: Pixi, Three, Tabla HTML, Divs + Css tienen una buena compatibilidad con Node y se trabaja muy bien asi no tengo ninguna queja para estos.

**Conclusión**:

Después de estar haciendo el resumen de todas las aplicaciones viendo las funcionalidades logradas, su complejidad y las compatibilidades que llevan me he decantado por Pixi.js.

Las razones que me llevaron a elegir pixi fueron las siguientes:

\-Tiene una complejidad media-alta pero da buenos resultados

\-Las funcionalidades que ofrecen son muy buenas

\-Pixi trabaja exclusivamente en 2D

\-Tiene buena integración a Node

Razones por las que dejé fuera a los demás:

\-Para trabajar exclusivamente en 2D no hace falta Three.js pese a que logré mucho y seguramente se puedan conseguir los mismos resultados que en Pixi.

\-Phaser es un buen framework , tuve muchos avances pero no vi la necesidad de tener un mapa con renderizado de juegos para nuestro proyecto.

\-D3 no conseguí los resultados que quería

\-Construct 3 está más diseñado para creación de juegos sin programación y sin forma de interactuar de forma eficaz con el en Node a mi criterio

\-Cocos no tuve los resultados esperados pero también lo descarté por tener un enfoque más a videojuegos.

\-Tabla Html, Div+ Css: Demasiado básicos sin dar juego a interacciones en el mapa como lo hacen otros frameworks
