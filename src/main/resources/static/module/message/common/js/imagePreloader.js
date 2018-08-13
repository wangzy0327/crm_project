function ImagePreloader(images, call_back)
{
    this.call_back = call_back;
    this.nLoaded = 0;
    this.nProcessed = 0;
    this.aImages = [];
    this.nImages = images.length;
    for ( var i = 0; i < images.length; i++ )
        this.preload(images[i]);
}

ImagePreloader.prototype.preload = function(image)
{
    var oImage = new Image();
    this.aImages.push(oImage);

    oImage.onload = ImagePreloader.prototype.onload;
    oImage.onerror = ImagePreloader.prototype.onerror;
    oImage.onabort = ImagePreloader.prototype.onabort;

    oImage.oImagePreloader = this;
    oImage.bLoaded = false;

    oImage.src = image;
};

ImagePreloader.prototype.onComplete = function()
{
      this.nProcessed++;
      if ( this.nProcessed == this.nImages )
      {
       this.call_back(this.aImages, this.nLoaded);
      }
};

ImagePreloader.prototype.onload = function()
{
      this.bLoaded = true;
      this.oImagePreloader.nLoaded++;
      this.oImagePreloader.onComplete();
};

ImagePreloader.prototype.onerror = function()
{
      this.bError = true;
      this.oImagePreloader.onComplete();
};

ImagePreloader.prototype.onabort = function()
{
      this.bAbort = true;
      this.oImagePreloader.onComplete();
};