
(function () {

    /* ==================================================
       EDGAR GIOVANNI — INTERACTIVE PORTFOLIO
       ARCHIVO: script.js
       LIBRERÍA: Three.js r128
    ================================================== */


    /* ==================================================
       01. CONFIGURACIÓN Y ELEMENTOS HTML
       Función: localizar los elementos de la página.
    ================================================== */

    var $ = function (id) {
        return document.getElementById(id);
    };

    var container = $('camera-scene');
    var panel = $('panel');
    var hover = $('hover');
    var menu = $('menu');
    var fallback = $('fallback');

    if (!container || !panel || !hover || !menu || !fallback) {
        console.error('No se encontraron todos los elementos HTML necesarios.');
        return;
    }


    /* ==================================================
       02. CONTENIDO DE LAS SECCIONES
       Función: almacenar la información de cada parte.
    ================================================== */

    var SECTIONS = {

        foto: {
            part: 'Lente',
            title: 'Fotografía',
            text: 'Retrato, producto y fotografía documental con una mirada cinematográfica y luz cuidada.',
            list: [
                'Retrato',
                'Producto',
                'Documental'
            ]
        },

        video: {
            part: 'Visor',
            title: 'Producción audiovisual',
            text: 'Desde la idea hasta la edición final: guion, grabación, montaje y color.',
            list: [
                'Video corporativo',
                'Reels y contenido social',
                'Edición y color'
            ]
        },

        diseno: {
            part: 'Cuerpo',
            title: 'Diseño gráfico',
            text: 'Identidad visual, piezas gráficas y sistemas de diseño con estética minimalista.',
            list: [
                'Branding',
                'Material impreso',
                'Diseño digital'
            ]
        },

        top: {
            part: 'Disparador',
            title: 'Proyectos destacados',
            text: 'Una selección de los trabajos que mejor representan mi estilo y mi proceso.',
            list: [
                'Proyecto 1 (agrega aquí)',
                'Proyecto 2 (agrega aquí)',
                'Proyecto 3 (agrega aquí)'
            ]
        }

    };


    /* ==================================================
       03. PANEL DE INFORMACIÓN
       Función: abrir y cerrar las secciones del portafolio.
    ================================================== */

    function openSection(key) {

        var section = SECTIONS[key];

        if (!section) return;

        $('p-kicker').textContent = section.part;
        $('p-title').textContent = section.title;
        $('p-text').textContent = section.text;

        // Crear la lista de elementos.
        var list = $('p-list');
        list.innerHTML = '';

        section.list.forEach(function (item) {

            var li = document.createElement('li');
            li.textContent = item;

            list.appendChild(li);

        });

        // Mostrar panel.
        panel.classList.add('open');

        // Marcar botón seleccionado.
        Array.prototype.forEach.call(menu.children, function (button) {

            button.classList.toggle(
                'on',
                button.dataset.k === key
            );

        });

    }


    function closeSection() {

        panel.classList.remove('open');

        Array.prototype.forEach.call(menu.children, function (button) {
            button.classList.remove('on');
        });

    }


    /* ==================================================
       04. CREACIÓN DEL MENÚ
       Función: generar botones para cada sección.
    ================================================== */

    Object.keys(SECTIONS).forEach(function (key) {

        var button = document.createElement('button');

        button.dataset.k = key;
        button.textContent = SECTIONS[key].title;

        button.onclick = function () {
            openSection(key);
        };

        menu.appendChild(button);

    });


    $('close').onclick = closeSection;


    /* ==================================================
       05. INICIALIZACIÓN DE THREE.JS
       Función: crear el renderizador y comprobar WebGL.
    ================================================== */

    if (!window.THREE) {

        fallback.style.display = 'grid';

        console.error('Three.js no se pudo cargar.');

        return;

    }

    var renderer;

    try {

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

    } catch (error) {

        fallback.style.display = 'grid';

        console.error('No se pudo iniciar WebGL:', error);

        return;

    }


    /* ==================================================
       06. CONFIGURACIÓN DE LA ESCENA 3D
       Función: crear escena, cámara y renderizador.
    ================================================== */

    var scene = new THREE.Scene();

    var cam = new THREE.PerspectiveCamera(
        38,
        1,
        0.1,
        100
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);


    /* ==================================================
       07. ILUMINACIÓN PRINCIPAL
       Función: iluminar la cámara 3D.
    ================================================== */

    // Luz ambiental.
    scene.add(
        new THREE.AmbientLight(0xffffff, 0.25)
    );


    // Luz principal.
    var key = new THREE.DirectionalLight(
        0xffffff,
        0.9
    );

    key.position.set(3, 4, 6);

    scene.add(key);


    // Luz celeste frontal.
    var blue = new THREE.PointLight(
        0x83d5f2,
        1.4,
        18
    );

    blue.position.set(2, 2, 3);

    scene.add(blue);


    // Luz celeste posterior.
    var back = new THREE.PointLight(
        0x83d5f2,
        1.0,
        14
    );

    back.position.set(-3, -2, -3);

    scene.add(back);


    /* ==================================================
       08. ENTORNO DE ESTUDIO
       Función: generar reflejos para metal y cristal.
    ================================================== */

    (function () {

        var pm = new THREE.PMREMGenerator(renderer);

        var environmentScene = new THREE.Scene();

        // Fondo oscuro del entorno.
        var environmentBackground = new THREE.Mesh(
            new THREE.BoxGeometry(30, 30, 30),
            new THREE.MeshBasicMaterial({
                color: 0x0a0e13,
                side: THREE.BackSide
            })
        );

        environmentScene.add(environmentBackground);


        // Crear paneles de iluminación.
        function panelLight(w, h, x, y, z, r, g, b) {

            var material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide
            });

            material.color.setRGB(r, g, b);

            var lightPanel = new THREE.Mesh(
                new THREE.PlaneGeometry(w, h),
                material
            );

            lightPanel.position.set(x, y, z);

            lightPanel.lookAt(0, 0, 0);

            environmentScene.add(lightPanel);

        }


        // Softboxes del entorno.
        panelLight(9, 5, 5, 7, 9, 6, 6, 6);

        panelLight(2, 10, -9, 1, 4, 1.6, 2.8, 3.4);

        panelLight(10, 2, 0, 5, -10, 4, 4, 4);

        panelLight(6, 6, 9, -1, 2, 1.2, 1.2, 1.4);


        // Aplicar entorno a la escena.
        scene.environment = pm.fromScene(
            environmentScene,
            0.02
        ).texture;

        pm.dispose();

    })();


    /* ==================================================
       09. GRUPO PRINCIPAL Y ELEMENTOS INTERACTIVOS
       Función: agrupar la cámara y registrar sus partes.
    ================================================== */

    var group = new THREE.Group();

    scene.add(group);

    var hits = [];

    var H = Math.PI / 2;


    /* ==================================================
       10. GENERADORES DE TEXTURAS
       Función: crear texturas de ruido y relieves.
    ================================================== */

    function noiseTex(size, rep, contrast) {

        var canvas = document.createElement('canvas');

        canvas.width = canvas.height = size;

        var context = canvas.getContext('2d');

        var data = context.createImageData(size, size);

        for (var i = 0; i < data.data.length; i += 4) {

            var value = 128 + (Math.random() - 0.5) * contrast;

            data.data[i] = value;
            data.data[i + 1] = value;
            data.data[i + 2] = value;
            data.data[i + 3] = 255;

        }

        context.putImageData(data, 0, 0);

        var texture = new THREE.CanvasTexture(canvas);

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        texture.repeat.set(rep, rep);

        return texture;

    }


    // Textura de relieves para superficies estriadas.
    function ribTex(rep) {

        var canvas = document.createElement('canvas');

        canvas.width = 64;
        canvas.height = 8;

        var context = canvas.getContext('2d');

        context.fillStyle = '#777';
        context.fillRect(0, 0, 64, 8);

        context.fillStyle = '#fff';
        context.fillRect(0, 0, 32, 8);

        var texture = new THREE.CanvasTexture(canvas);

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        texture.repeat.set(rep, 1);

        return texture;

    }


    /* ==================================================
       11. MATERIALES DE LA CÁMARA
       Función: definir colores, metal y texturas.
    ================================================== */

    var mBody = new THREE.MeshStandardMaterial({
        color: 0x1d2127,
        metalness: 0.2,
        roughness: 0.55,
        bumpMap: noiseTex(256, 8, 120),
        bumpScale: 0.6,
        envMapIntensity: 0.8
    });


    var mRubber = new THREE.MeshStandardMaterial({
        color: 0x101216,
        metalness: 0,
        roughness: 0.85,
        bumpMap: noiseTex(256, 14, 255),
        bumpScale: 1.2,
        envMapIntensity: 0.5
    });


    var mLens = new THREE.MeshStandardMaterial({
        color: 0x181b20,
        metalness: 0.55,
        roughness: 0.38,
        bumpMap: noiseTex(256, 10, 60),
        bumpScale: 0.3,
        envMapIntensity: 1.1
    });


    var mZoom = new THREE.MeshStandardMaterial({
        color: 0x0e1013,
        metalness: 0.1,
        roughness: 0.8,
        bumpMap: ribTex(90),
        bumpScale: 2.2,
        envMapIntensity: 0.5
    });


    var mKnurl = new THREE.MeshStandardMaterial({
        color: 0xb4bec8,
        metalness: 1,
        roughness: 0.3,
        bumpMap: ribTex(28),
        bumpScale: 1.5,
        envMapIntensity: 1.6
    });


    var mSilver = new THREE.MeshStandardMaterial({
        color: 0xaab6c0,
        metalness: 1,
        roughness: 0.2,
        envMapIntensity: 1.6
    });


    var mDark = new THREE.MeshStandardMaterial({
        color: 0x07090c,
        metalness: 0.6,
        roughness: 0.3,
        envMapIntensity: 1
    });


    var mRed = new THREE.MeshStandardMaterial({
        color: 0xc8102e,
        metalness: 0.2,
        roughness: 0.35
    });


    var mBlue = new THREE.MeshStandardMaterial({
        color: 0x83d5f2,
        emissive: 0x3198c0,
        emissiveIntensity: 1.2,
        metalness: 0.4,
        roughness: 0.2
    });


    /* ==================================================
       12. FUNCIONES AUXILIARES DE GEOMETRÍA
       Función: simplificar la creación de piezas 3D.
    ================================================== */

    // Registrar una pieza y asignarle una sección.
    function reg(mesh, sec, x, y, z, rx) {

        mesh.position.set(x, y, z);

        if (rx) {
            mesh.rotation.x = rx;
        }

        mesh.userData.section = sec;

        group.add(mesh);

        hits.push(mesh);

        return mesh;

    }


    // Crear formas rectangulares con esquinas redondeadas.
    function rr(w, h, r) {

        var shape = new THREE.Shape();

        var x = -w / 2;
        var y = -h / 2;

        shape.moveTo(x + r, y);

        shape.lineTo(x + w - r, y);

        shape.quadraticCurveTo(x + w, y, x + w, y + r);

        shape.lineTo(x + w, y + h - r);

        shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);

        shape.lineTo(x + r, y + h);

        shape.quadraticCurveTo(x, y + h, x, y + h - r);

        shape.lineTo(x, y + r);

        shape.quadraticCurveTo(x, y, x + r, y);

        return shape;

    }


    // Crear caja con esquinas biseladas.
    function rbox(w, h, d, r, material) {

        var b = 0.05;

        var geometry = new THREE.ExtrudeGeometry(
            rr(
                w - 2 * b,
                h - 2 * b,
                Math.max(r - b, 0.01)
            ),
            {
                depth: d - 2 * b,
                bevelEnabled: true,
                bevelThickness: b,
                bevelSize: b,
                bevelSegments: 4,
                curveSegments: 10
            }
        );

        geometry.center();

        return new THREE.Mesh(geometry, material);

    }


    // Caja sencilla.
    var box = function (w, h, d, material) {

        return new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            material
        );

    };


    // Cilindro.
    var cyl = function (r, h, material, segments, open) {

        return new THREE.Mesh(
            new THREE.CylinderGeometry(
                r,
                r,
                h,
                segments || 64,
                1,
                !!open
            ),
            material
        );

    };


    // Anillo toroidal.
    var tor = function (r, thickness, material) {

        return new THREE.Mesh(
            new THREE.TorusGeometry(r, thickness, 14, 72),
            material
        );

    };


    /* ==================================================
       13. CUERPO PRINCIPAL Y AGARRE
       Función: construir la estructura exterior.
       Sección interactiva: DISEÑO GRÁFICO.
    ================================================== */

    // Cuerpo central.
    reg(
        rbox(3.0, 2.0, 1.1, 0.2, mBody),
        'diseno',
        0, 0, 0
    );


    // Agarre lateral de goma.
    reg(
        rbox(0.74, 2.0, 0.55, 0.14, mRubber),
        'diseno',
        -1.12, 0, 0.7
    );


    // Detalle rojo del agarre.
    reg(
        box(0.05, 1.7, 0.04, mRed),
        'diseno',
        -0.76, 0, 0.985
    );


    // Detalle circular.
    reg(
        new THREE.Mesh(
            new THREE.CircleGeometry(0.05, 24),
            mDark
        ),
        'diseno',
        -0.95, 0.65, 0.98
    );


    /* ==================================================
       14. PENTAPRISMA Y VISOR
       Función: construir la parte superior de la cámara.
       Sección interactiva: PRODUCCIÓN AUDIOVISUAL.
    ================================================== */

    var shape = new THREE.Shape();

    shape.moveTo(-0.45, 0);
    shape.lineTo(-0.45, 0.3);
    shape.lineTo(-0.18, 0.56);
    shape.lineTo(0.22, 0.56);
    shape.lineTo(0.45, 0.32);
    shape.lineTo(0.45, 0);
    shape.lineTo(-0.45, 0);


    var pg = new THREE.ExtrudeGeometry(
        shape,
        {
            depth: 1.0,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 3
        }
    );

    pg.rotateY(-H);

    pg.translate(0.5, 0, 0);


    // Pentaprisma.
    reg(
        new THREE.Mesh(pg, mBody),
        'video',
        0, 1.0, 0
    );


    // Parte superior del visor.
    reg(
        box(0.5, 0.04, 0.12, mDark),
        'video',
        0, 1.2, 0.5
    );


    // Visor posterior.
    reg(
        rbox(0.5, 0.2, 0.14, 0.05, mRubber),
        'video',
        0, 1.2, -0.6
    );


    /* ==================================================
       15. CONTROLES SUPERIORES Y BOTONES
       Función: añadir ruedas y controles de la cámara.
    ================================================== */

    // Rueda principal.
    reg(
        cyl(0.26, 0.16, mKnurl, 48),
        'diseno',
        1.05, 1.08, 0.1
    );


    // Detalle de la rueda.
    reg(
        cyl(0.21, 0.03, mDark, 32),
        'diseno',
        1.05, 1.17, 0.1
    );


    // Disparador.
    reg(
        cyl(0.23, 0.05, mDark, 32),
        'top',
        -1.1, 1.02, 0.7
    );


    reg(
        cyl(0.15, 0.12, mBlue, 32),
        'top',
        -1.1, 1.08, 0.7
    );


    // Pequeños controles frontales.
    for (var i = 0; i < 4; i++) {

        reg(
            new THREE.Mesh(
                new THREE.CircleGeometry(0.025, 12),
                mDark
            ),
            'diseno',
            0.5 + i * 0.1,
            1.003,
            0.3,
            -H
        );

    }


    // Controles laterales.
    [-1, 1].forEach(function (sx) {

        reg(
            cyl(0.07, 0.14, mSilver, 20),
            'diseno',
            sx * 1.54,
            0.7,
            0
        ).rotation.z = H;

    });


    /* ==================================================
       16. LOGOTIPO CANON
       Función: generar y colocar el logotipo en el cuerpo.
    ================================================== */

    var cv = document.createElement('canvas');

    cv.width = 256;
    cv.height = 96;

    var cx = cv.getContext('2d');

    cx.fillStyle = '#f2f4f6';

    cx.font = 'italic bold 64px Georgia,serif';

    cx.textAlign = 'center';

    cx.textBaseline = 'middle';

    cx.fillText('Canon', 128, 50);


    var logoTexture = new THREE.CanvasTexture(cv);

    reg(
        new THREE.Mesh(
            new THREE.PlaneGeometry(0.7, 0.26),
            new THREE.MeshBasicMaterial({
                map: logoTexture,
                transparent: true
            })
        ),
        'diseno',
        1.0, 0.68, 0.56
    );


    /* ==================================================
       17. LENTE 18-55 MM
       Función: construir el objetivo fotográfico.
       Sección interactiva: FOTOGRAFÍA.
    ================================================== */

    var LY = -0.1;


    // Base metálica del lente.
    reg(
        cyl(0.95, 0.08, mSilver),
        'foto',
        0, LY, 0.58,
        H
    );


    // Primer cuerpo del objetivo.
    reg(
        cyl(0.78, 0.5, mLens),
        'foto',
        0, LY, 0.95,
        H
    );


    // Anillo metálico.
    reg(
        tor(0.8, 0.025, mSilver),
        'foto',
        0, LY, 0.97
    );


    // Anillo de zoom.
    reg(
        cyl(0.84, 0.5, mZoom),
        'foto',
        0, LY, 1.2,
        H
    );


    // Cuerpo frontal.
    reg(
        cyl(0.7, 0.45, mLens, 64, true),
        'foto',
        0, LY, 1.55,
        H
    );


    // Anillo frontal.
    reg(
        new THREE.Mesh(
            new THREE.RingGeometry(0.56, 0.7, 64),
            mLens
        ),
        'foto',
        0, LY, 1.776
    );


    // Borde metálico frontal.
    reg(
        tor(0.575, 0.015, mSilver),
        'foto',
        0, LY, 1.777
    );


    // Interior del lente.
    var tube = cyl(0.56, 0.33, mDark, 48, true);

    tube.material = mDark.clone();

    tube.material.side = THREE.BackSide;

    reg(
        tube,
        'foto',
        0, LY, 1.615,
        H
    );


    // Cristal oscuro frontal.
    reg(
        new THREE.Mesh(
            new THREE.CircleGeometry(0.56, 48),
            new THREE.MeshStandardMaterial({
                color: 0x04080c,
                metalness: 0.2,
                roughness: 0.2,
                envMapIntensity: 1.5
            })
        ),
        'foto',
        0, LY, 1.455
    );


    // Cristal curvo.
    var dome = new THREE.Mesh(
        new THREE.SphereGeometry(
            1.2,
            64,
            24,
            0,
            Math.PI * 2,
            0,
            0.4755
        ),
        new THREE.MeshPhysicalMaterial({
            color: 0x081620,
            metalness: 0,
            roughness: 0.03,
            clearcoat: 1,
            clearcoatRoughness: 0.02,
            transparent: true,
            opacity: 0.82,
            envMapIntensity: 3.2
        })
    );

    reg(
        dome,
        'foto',
        0, LY, 0.42,
        H
    );


    // Reflejo violeta del lente.
    reg(
        new THREE.Mesh(
            new THREE.RingGeometry(0.4, 0.53, 64),
            new THREE.MeshBasicMaterial({
                color: 0x7a3ff0,
                transparent: true,
                opacity: 0.18,
                side: THREE.DoubleSide
            })
        ),
        'foto',
        0, LY, 1.7
    );


    // Borde celeste del objetivo.
    reg(
        tor(
            0.5,
            0.012,
            new THREE.MeshBasicMaterial({
                color: 0x83d5f2
            })
        ),
        'foto',
        0, LY, 1.72
    );


    // Detalle lateral del cuerpo.
    reg(
        cyl(0.1, 0.06, mSilver, 24),
        'diseno',
        1.1, -0.25, 0.58,
        H
    );


    /* ==================================================
       18. SOMBRA DE LA CÁMARA
       Función: crear profundidad visual bajo el modelo.
    ================================================== */

    var sc = document.createElement('canvas');

    sc.width = sc.height = 128;

    var sg = sc.getContext('2d');

    var gr = sg.createRadialGradient(
        64, 64, 0,
        64, 64, 64
    );

    gr.addColorStop(0, 'rgba(0,0,0,.75)');

    gr.addColorStop(1, 'rgba(0,0,0,0)');

    sg.fillStyle = gr;

    sg.fillRect(0, 0, 128, 128);


    var shadowTexture = new THREE.CanvasTexture(sc);

    var shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(5.5, 3.2),
        new THREE.MeshBasicMaterial({
            map: shadowTexture,
            transparent: true,
            depthWrite: false
        })
    );

    shadow.rotation.x = -H;

    shadow.position.set(0, -2.35, -0.2);

    scene.add(shadow);


    /* ==================================================
       19. POSICIÓN INICIAL DEL MODELO
       Función: establecer la ubicación de la cámara 3D.
    ================================================== */

    group.position.z = -0.4;


    /* ==================================================
       20. MOVIMIENTO DEL PUNTERO
       Función: controlar la rotación con mouse o touch.
    ================================================== */

    var tx = 0;
    var ty = 0;
    var hasMoved = false;


    /* ==================================================
       21. DETECCIÓN DE PARTES (RAYCASTER)
       Función: identificar qué pieza está bajo el puntero.
    ================================================== */

    var ray = new THREE.Raycaster();

    var mouse = new THREE.Vector2();


    function pick(event, onlyHover) {

        var rect = container.getBoundingClientRect();

        mouse.x = (
            (event.clientX - rect.left) / rect.width
        ) * 2 - 1;

        mouse.y = -(
            (event.clientY - rect.top) / rect.height
        ) * 2 + 1;


        ray.setFromCamera(mouse, cam);


        var intersections = ray.intersectObjects(hits, false);

        var hit = intersections[0];

        var section = hit && hit.object.userData.section;


        // Mostrar nombre al pasar el puntero.
        if (onlyHover) {

            container.style.cursor = section ? 'pointer' : 'grab';

            if (section) {

                hover.textContent =
                    SECTIONS[section].part +
                    ' · ' +
                    SECTIONS[section].title;

                hover.style.opacity = 1;

            } else {

                hover.style.opacity = 0;

            }

            return;

        }


        return section;

    }


    /* ==================================================
       22. INTERACCIÓN CON EL MOUSE
       Función: rotar el modelo y mostrar información.
    ================================================== */

    window.addEventListener('pointermove', function (event) {

        tx = (
            event.clientY / window.innerHeight * 2 - 1
        ) * 0.2;

        ty = (
            event.clientX / window.innerWidth * 2 - 1
        ) * 0.45;

        hasMoved = true;

        pick(event, true);

    });


    window.addEventListener('pointerleave', function () {

        tx = 0;
        ty = 0;

    });


    /* ==================================================
       23. CLICS Y SELECCIÓN DE SECCIONES
       Función: abrir el panel al seleccionar una pieza.
    ================================================== */

    container.addEventListener('pointerdown', function (event) {

        var section = pick(event, false);

        if (section) {

            openSection(section);

        } else if (event.pointerType === 'touch') {

            // Permitir movimiento táctil fuera de las piezas.
            tx = (
                event.clientY / window.innerHeight * 2 - 1
            ) * 0.2;

            ty = (
                event.clientX / window.innerWidth * 2 - 1
            ) * 0.45;

        }

    });


    /* ==================================================
       24. ADAPTACIÓN RESPONSIVE
       Función: ajustar cámara y modelo al tamaño de pantalla.
    ================================================== */

    function resize() {

        var w = container.clientWidth || window.innerWidth;

        var h = container.clientHeight || window.innerHeight;

        var aspect = w / h;


        cam.aspect = aspect;

        cam.position.set(
            0,
            0.8,
            aspect < 0.8 ? 15 : 10
        );

        cam.lookAt(0, 0, 0);


        // Desplazar el modelo en pantallas grandes.
        group.position.x = w > 760 ? 0.9 : 0;


        cam.updateProjectionMatrix();

        renderer.setSize(w, h);

    }


    window.addEventListener('resize', resize);

    resize();


    /* ==================================================
       25. ANIMACIÓN PRINCIPAL
       Función: movimiento automático y renderizado 3D.
    ================================================== */

    var t0 = performance.now();


    function loop(now) {

        requestAnimationFrame(loop);

        var t = (now - t0) / 1000;


        // Movimiento suave automático.
        var idleY = hasMoved ? 0 : Math.sin(t * 0.5) * 0.35;


        // Rotación horizontal y vertical.
        group.rotation.x += (
            tx - group.rotation.x
        ) * 0.05;


        group.rotation.y += (
            (ty + idleY + 0.3) - group.rotation.y
        ) * 0.05;


        // Pequeña inclinación.
        group.rotation.z = Math.sin(t * 0.7) * 0.03;


        // Movimiento vertical flotante.
        group.position.y = Math.sin(t * 1.1) * 0.12;


        // Movimiento de la sombra.
        shadow.position.x = group.position.x;

        shadow.material.opacity =
            0.55 - group.position.y * 0.8;


        // Variación de iluminación celeste.
        blue.intensity = 1.6 + Math.sin(t * 1.5) * 0.25;


        // Renderizar escena.
        renderer.render(scene, cam);

    }


    /* ==================================================
       26. INICIAR EXPERIENCIA
       Función: comenzar el ciclo de animación.
    ================================================== */

    requestAnimationFrame(loop);

    console.log(
        'Edgar Giovanni — Interactive Portfolio iniciado correctamente.'
    );

})();
