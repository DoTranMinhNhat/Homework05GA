document.addEventListener("DOMContentLoaded", function() {
    var video = document.getElementById("video");
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    video.addEventListener('play', function() {
        setInterval(detectEdges, 33); 
    }, false);

    function detectEdges() {
        if (video.paused || video.ended) {
            return;
        }
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        
        var grayData = new Uint8ClampedArray(canvas.width * canvas.height);
        for (var i = 0; i < data.length; i += 4) {
            var r = data[i];
            var g = data[i + 1];
            var b = data[i + 2];
            var gray = 0.2126 * r + 0.7152 * g + 0.0722 * b; 
            grayData[i / 4] = gray;
        }
        
        var edgeData = new Uint8ClampedArray(canvas.width * canvas.height);
        var threshold1 = 50; 
        var threshold2 = 150; 
        for (var i = 0; i < canvas.width * canvas.height; i++) {
            edgeData[i] = 255; 
        }
        
        for (var y = 1; y < canvas.height - 1; y++) {
            for (var x = 1; x < canvas.width - 1; x++) {
                var offset = y * canvas.width + x;
                var sum = 0;
                sum += 2 * grayData[(y - 1) * canvas.width + x - 1];
                sum += 4 * grayData[(y - 1) * canvas.width + x];
                sum += 2 * grayData[(y - 1) * canvas.width + x + 1];
                sum += 4 * grayData[y * canvas.width + x - 1];
                sum -= 16 * grayData[y * canvas.width + x];
                sum += 4 * grayData[y * canvas.width + x + 1];
                sum += 2 * grayData[(y + 1) * canvas.width + x - 1];
                sum += 4 * grayData[(y + 1) * canvas.width + x];
                sum += 2 * grayData[(y + 1) * canvas.width + x + 1];
                var magnitude = Math.abs(sum / 16);
                if (magnitude > threshold1) {
                    edgeData[offset] = 0; 
                }
            }
        }
        
        var edgeImageData = ctx.createImageData(canvas.width, canvas.height);
        for (var i = 0; i < edgeData.length; i++) {
            edgeImageData.data[i * 4] = edgeData[i];
            edgeImageData.data[i * 4 + 1] = edgeData[i];
            edgeImageData.data[i * 4 + 2] = edgeData[i];
            edgeImageData.data[i * 4 + 3] = 255; 
        }
        ctx.putImageData(edgeImageData, 0, 0);
    }
});